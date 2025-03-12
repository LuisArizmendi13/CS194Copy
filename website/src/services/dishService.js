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
