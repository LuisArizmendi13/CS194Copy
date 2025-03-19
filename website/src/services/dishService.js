// src/services/dishService.js
import { dynamoDb, TABLE_NAME, getUserRestaurantId } from "../aws-config";

// Fetch dishes for a restaurant.
export const fetchDishes = async (restaurantId) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "restaurantId = :rId",
    ExpressionAttributeValues: { ":rId": restaurantId },
  };
  const data = await dynamoDb.scan(params).promise();
  return data.Items;
};

// Fetch unique ingredients from all dishes for a restaurant
export const fetchIngredients = async (session) => {
  try {
    const restaurantId = getUserRestaurantId(session);
    
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "restaurantId = :rId",
      ExpressionAttributeValues: { ":rId": restaurantId },
    };
    
    const data = await dynamoDb.scan(params).promise();
    
    // Extract all ingredients from all dishes and remove duplicates
    const ingredients = data.Items.reduce((acc, item) => {
      if (item.ingredients && Array.isArray(item.ingredients)) {
        acc.push(...item.ingredients);
      }
      return acc;
    }, []);
    
    // Return unique, sorted ingredients
    return [...new Set(ingredients)].sort();
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw new Error("Failed to fetch ingredients");
  }
};

// Delete a dish by dishId with error handling.
export const deleteDish = async (dishId) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { dishId },
    };

    await dynamoDb.delete(params).promise();
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw new Error("Failed to delete dish");
  }
};

// Modify an existing dish by dishId.
export const modifyDish = async (dish) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { dishId: dish.dishId },
    UpdateExpression: "SET #dishName = :name, description = :description, price = :price, ingredients = :ingredients",
    ExpressionAttributeNames: {
      "#dishName": "name", // ✅ Avoids reserved keyword issue
    },
    ExpressionAttributeValues: {
      ":name": dish.name,
      ":description": dish.description,
      ":price": dish.price,
      ":ingredients": dish.ingredients || [],
    },
  };

  await dynamoDb.update(params).promise();
};

// Add a new dish to the database.
export const addDishToDatabase = async (dish, restaurantId) => {
  if (!restaurantId) {
    throw new Error("❌ Cannot save dish: No restaurantId found!");
  }

  const dishWithRestaurant = { ...dish, restaurantId };

  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: dishWithRestaurant,
  }).promise();

  return dishWithRestaurant;
};