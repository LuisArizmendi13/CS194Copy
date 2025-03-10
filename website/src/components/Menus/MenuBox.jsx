import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dynamoDb, MENUS_TABLE_NAME } from "../../aws-config";
import DeleteButtonWithConfirmation from "../DeleteButtonWithConfirmation";

const MenuBox = ({ menu, onDelete, setLiveMenu }) => {
  const [showLiveMenuConfirmation, setShowLiveMenuConfirmation] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Unset any other live menus for this restaurant
  const unsetOtherLiveMenus = async (restaurantId, newLiveMenuId) => {
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
        if (item.menuID !== newLiveMenuId) {
          updatePromises.push(
            dynamoDb
              .update({
                TableName: MENUS_TABLE_NAME,
                Key: { menuID: item.menuID },
                UpdateExpression: "SET isLive = :false",
                ExpressionAttributeValues: { ":false": false },
              })
              .promise()
          );
        }
      });
    }
    await Promise.all(updatePromises);
  };

  const confirmSetLiveMenu = async () => {
    setShowLiveMenuConfirmation(false);
    try {
      // Update the selected menu to be live
      await dynamoDb
        .update({
          TableName: MENUS_TABLE_NAME,
          Key: { menuID: menu.menuID },
          UpdateExpression: "SET isLive = :live",
          ExpressionAttributeValues: { ":live": true },
        })
        .promise();

      // Unset any other live menus for the same restaurant
      await unsetOtherLiveMenus(menu.restaurantId, menu.menuID);

      // Update sessionStorage and dispatch an event to notify LiveMenuPage.
      sessionStorage.setItem("liveMenuID", menu.menuID);
      window.dispatchEvent(new Event("liveMenuUpdated"));

      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error setting live menu:", error);
    }
  };

  return (
    <div className="border rounded p-4 flex flex-col items-start mb-4 shadow w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <Link
            to={`/menus/${menu.menuID}`}
            className="text-lg font-bold text-blue-600 hover:underline"
          >
            {menu.name || "Untitled Menu"}
          </Link>
          <p className="text-gray-600 mt-1">
            {menu.description || "No description available"}
          </p>
        </div>
        <div className="flex gap-2">
          {menu.isLive ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded cursor-default"
              disabled
            >
              Live Menu
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setShowLiveMenuConfirmation(true)}
            >
              Set to Live Menu
            </button>
          )}
          {onDelete && (
            <DeleteButtonWithConfirmation
              onConfirm={async () => {
                try {
                  await dynamoDb
                    .delete({
                      TableName: MENUS_TABLE_NAME,
                      Key: { menuID: menu.menuID },
                    })
                    .promise();
                  console.log(`✅ Successfully deleted menu: ${menu.menuID}`);
                  onDelete(menu.menuID);
                } catch (error) {
                  console.error("❌ Error deleting menu from DynamoDB:", error);
                }
              }}
              message="Are you sure you want to delete this menu?"
              buttonText="Delete"
            />
          )}
        </div>
      </div>

      {/* Live Menu Confirmation Modal */}
      {showLiveMenuConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">
              Are you sure you want to set this menu as the Live Menu?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={confirmSetLiveMenu}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowLiveMenuConfirmation(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">Live menu updated successfully!</p>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBox;
