// src/services/dishService.js
import { dynamoDb, TABLE_NAME } from "../aws-config";

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
    UpdateExpression: "SET name = :name, price = :price, ingredients = :ingredients",
    ExpressionAttributeValues: {
      ":name": dish.name,
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
