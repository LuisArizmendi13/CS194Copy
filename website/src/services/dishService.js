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

// Delete a dish by dishId.
export const deleteDish = async (dishId) => {
  await dynamoDb.delete({ TableName: TABLE_NAME, Key: { dishId } }).promise();
};

export const addDishToDatabase = async (dish, restaurantId) => {
  if (!restaurantId) {
    throw new Error("❌ Cannot save dish: No restaurantId found!");
  }

  const dishWithRestaurant = { ...dish, restaurantId };

  await dynamoDb.put({
    TableName: TABLE_NAME,
    Item: dishWithRestaurant,
  }).promise();

  return dishWithRestaurant; // ✅ Return the saved dish
};
