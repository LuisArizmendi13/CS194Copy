require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const OpenAI = require("openai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const textract = new AWS.Textract({ region: "us-east-2" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME_DISHES = "Dishes";
const TABLE_NAME_MENUS = "Menus";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Extract restaurant ID from Cognito Token
const getUserRestaurantId = (req) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error("Missing Authorization Header");

        const token = authHeader.split(" ")[1];
        const decodedToken = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        );

        return decodedToken["custom:restaurantID"];
    } catch (error) {
        console.error("❌ Error extracting restaurant ID:", error);
        return null;
    }
};

app.post("/api/upload-menu", upload.single("file"), async (req, res) => {
    try {
        console.log(`📄 Received file: ${req.file.originalname}`);

        // ✅ Get restaurant ID from Cognito session
        const restaurantId = getUserRestaurantId(req);
        if (!restaurantId) {
            return res.status(400).json({ message: "❌ Restaurant ID missing!" });
        }

        const { menuName } = req.body; // ✅ Get menu name from user input

        // Step 1: Extract Text from AWS Textract
        const params = {
            Document: { Bytes: req.file.buffer },
            FeatureTypes: ["TABLES", "FORMS"]
        };

        console.log("📝 Sending to AWS Textract...");
        const textractData = await textract.analyzeDocument(params).promise();
        const extractedText = textractData.Blocks
            .filter(block => block.BlockType === "LINE")
            .map(line => line.Text)
            .join("\n");

        console.log("📝 Extracted Text from AWS Textract:", extractedText);

        // Step 2: Send Extracted Text to ChatGPT
        console.log("🤖 Asking ChatGPT...");
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that extracts restaurant menu data." },
                { role: "user", content: `Extract all dish names, descriptions, and prices in a structured JSON format from the following menu text:\n${extractedText}. Return output as JSON array of objects with keys: name, description, and price.` }
            ]
        });

        const chatResult = chatResponse.choices[0].message.content;
        console.log("✅ ChatGPT Response:", chatResult);

        // Step 3: Parse ChatGPT Response into Dish Objects
        let parsedDishes;
        try {
            parsedDishes = JSON.parse(chatResult);
            if (!Array.isArray(parsedDishes) || parsedDishes.length === 0) {
                throw new Error("No valid dishes extracted.");
            }
        } catch (error) {
            console.error("❌ Error parsing ChatGPT response:", error);
            return res.status(500).json({ message: "Failed to parse ChatGPT response." });
        }

        console.log("🍽 Parsed Dishes Before Price Fix:", parsedDishes);

        // ✅ Convert price values to valid numbers (strip `$` and parseFloat)
        parsedDishes = parsedDishes.map(dish => ({
            name: dish.name,
            description: dish.description,
            price: parseFloat(dish.price.replace(/[^0-9.]/g, "")), // ✅ Remove "$" and parse to float
            ingredients: []
        }));

        console.log("🍽 Parsed Dishes After Price Fix:", parsedDishes);

        // Step 4: Save Dishes to DynamoDB
        const dishEntries = parsedDishes.map(dish => ({
            dishId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            restaurantId,
            name: dish.name,
            description: dish.description,
            price: dish.price, // ✅ Now correctly formatted
            ingredients: [],
            sales: [],
            archive: false
        }));

        await Promise.all(
            dishEntries.map(dishItem =>
                dynamoDb.put({ TableName: TABLE_NAME_DISHES, Item: dishItem }).promise()
            )
        );

        console.log("✅ All dishes saved to DynamoDB!");

        // Step 5: Create a New Menu Entry
        const menuID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        await dynamoDb.put({
            TableName: TABLE_NAME_MENUS,
            Item: {
                menuID,
                restaurantId,
                name: menuName || `Generated Menu - ${new Date().toLocaleDateString()}`,
                dishes: dishEntries.map(dish => ({
                    name: dish.name,
                    dishId: dish.dishId,
                    price: dish.price
                })),
                createdAt: new Date().toISOString()
            }
        }).promise();

        console.log(`✅ New menu created: ${menuName || "Generated Menu"}`);

        res.json({ message: "✅ Menu processing complete!" });

    } catch (error) {
        console.error("❌ Error processing menu:", error);
        res.status(500).json({ message: "Server error during menu processing." });
    }
});

app.listen(port, () => console.log(`🚀 Backend running on http://localhost:${port}`));
