import { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { INGREDIENT_TABLE_NAME, getUserRestaurantId } from "../aws-config";
import { useAuth } from "../context/AuthContext";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const useFetchIngredients = () => {
  const { session } = useAuth();
  const [existingIngredients, setExistingIngredients] = useState([]); // Corrected state variable name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        if (!session) {
          console.warn("⚠️ No session found.");
          setLoading(false);
          return;
        }

        const restaurantId = getUserRestaurantId(session);
        if (!restaurantId) {
          console.warn("⚠️ No restaurantId found.");
          setLoading(false);
          return;
        }

        const params = {
          TableName: INGREDIENT_TABLE_NAME, // Ensure this is correctly defined in aws-config
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId }
        };

        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          const ingredientsNames = data.Items.map(ingredient => ingredient.name.toLowerCase()); // Corrected variable name
          setExistingIngredients(ingredientsNames);
        } else {
          console.warn("⚠️ No existing ingredients found.");
        }
      } catch (error) {
        console.error("❌ Error fetching ingredients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients(); // Corrected function call
  }, [session]);

  return { existingIngredients, loading };
};

export default useFetchIngredients;
