import React, { useState } from "react";
import { Link } from "react-router-dom";
import { dynamoDb, MENUS_TABLE_NAME } from "../../aws-config";

const MenuBox = ({ menu, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showLiveMenuConfirmation, setShowLiveMenuConfirmation] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirmation(false);
    try {
      await dynamoDb.delete({ TableName: MENUS_TABLE_NAME, Key: { menuID: menu.menuID } }).promise();
      console.log(`✅ Successfully deleted menu: ${menu.menuID}`);
      onDelete(menu.menuID);
    } catch (error) {
      console.error("❌ Error deleting menu from DynamoDB:", error);
    }
  };

  const handleSetLiveMenu = () => {
    setShowLiveMenuConfirmation(true); // ✅ Show confirmation before updating
  };

  const confirmSetLiveMenu = () => {
    setShowLiveMenuConfirmation(false);
    sessionStorage.setItem("liveMenuID", menu.menuID); // ✅ Store selection in session storage
    window.dispatchEvent(new Event("liveMenuUpdated")); // ✅ Notify LiveMenuPage.jsx
  };

  return (
    <div className="border rounded p-4 flex flex-col items-start mb-4 shadow w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <Link to={`/menus/${menu.menuID}`} className="text-lg font-bold text-blue-600 hover:underline">
            {menu.name || "Untitled Menu"}
          </Link>
          <p className="text-gray-600 mt-1">{menu.description || "No description available"}</p>
        </div>

        <div className="flex gap-2">
          {/* ✅ "Set to Live Menu" Button */}
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSetLiveMenu}
          >
            Set to Live Menu
          </button>

          {/* ✅ Delete Button */}
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">Are you sure you want to delete this menu?</p>
            <div className="flex gap-2 justify-center">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Confirm
              </button>
              <button onClick={() => setShowDeleteConfirmation(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Set Live Menu Confirmation Modal */}
      {showLiveMenuConfirmation && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">Are you sure you want to set this menu as the Live Menu?</p>
            <div className="flex gap-2 justify-center">
              <button onClick={confirmSetLiveMenu} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Confirm
              </button>
              <button onClick={() => setShowLiveMenuConfirmation(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBox;
