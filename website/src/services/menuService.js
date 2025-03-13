// src/services/menuService.js
import { dynamoDb, MENUS_TABLE_NAME } from "../aws-config";


// Create a manu
export const createMenu = async (newMenu) => {
    return dynamoDb.put({
      TableName: MENUS_TABLE_NAME,
      Item: newMenu,
    }).promise();
  };

// Fetch menus for a given restaurant ID.
export const fetchMenus = async (restaurantId) => {
  const params = {
    TableName: MENUS_TABLE_NAME,
    FilterExpression: "restaurantId = :rId",
    ExpressionAttributeValues: { ":rId": restaurantId },
  };
  const data = await dynamoDb.scan(params).promise();
  return data.Items;
};

// Delete a menu by menuID.
export const deleteMenuFromDatabase = async (menuID) => {
  await dynamoDb.delete({ TableName: MENUS_TABLE_NAME, Key: { menuID } }).promise();
};

// Set a menu as live and unset any other live menus.
export const setLiveMenu = async (menu, restaurantId) => {
  // Update the selected menu to be live.
  await dynamoDb.update({
    TableName: MENUS_TABLE_NAME,
    Key: { menuID: menu.menuID },
    UpdateExpression: "SET isLive = :live",
    ExpressionAttributeValues: { ":live": true },
  }).promise();

  // Unset any other live menus.
  const params = {
    TableName: MENUS_TABLE_NAME,
    FilterExpression: "restaurantId = :rId AND isLive = :live",
    ExpressionAttributeValues: {
      ":rId": restaurantId,
      ":live": true,
    },
  };
  const data = await dynamoDb.scan(params).promise();
  const updatePromises = [];
  if (data.Items) {
    data.Items.forEach((item) => {
      if (item.menuID !== menu.menuID) {
        updatePromises.push(
          dynamoDb.update({
            TableName: MENUS_TABLE_NAME,
            Key: { menuID: item.menuID },
            UpdateExpression: "SET isLive = :false",
            ExpressionAttributeValues: { ":false": false },
          }).promise()
        );
      }
    });
  }
  await Promise.all(updatePromises);
};

export const updateMenuInDatabase = async (menu) => {
  if (!menu || !menu.menuID) {
    throw new Error("❌ Cannot update menu: Invalid menu data.");
  }

  await dynamoDb.update({
    TableName: MENUS_TABLE_NAME,
    Key: { menuID: menu.menuID },
    UpdateExpression: "SET menuName = :name, description = :desc, dishes = :dishes",
    ExpressionAttributeValues: {
      ":name": menu.menuName,
      ":desc": menu.description,
      ":dishes": menu.dishes || [],
    },
  }).promise();

  return menu; // ✅ Returns updated menu for UI state updates
};

