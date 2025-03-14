import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteButtonWithConfirmation from "../DeleteButtonWithConfirmation";

const MenuBox = ({ menu, onDelete, setLiveMenu }) => {
  const [showLiveMenuConfirmation, setShowLiveMenuConfirmation] = useState(false);
  const [showLiveSuccessPopup, setShowLiveSuccessPopup] = useState(false);
  const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

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
          {menu.isLive ? (
            <button className="px-4 py-2 bg-green-500 text-white rounded cursor-default" disabled>
              Live Menu
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={() => setLiveMenu(menu.menuID)}
            >
              Set to Live Menu
            </button>
          )}
          {onDelete && (
            <DeleteButtonWithConfirmation
              onConfirm={() => onDelete(menu.menuID)} // ✅ Calls onDelete instead of direct DB deletion
              message="Are you sure you want to delete this menu?"
              buttonText="Delete"
            />
          )}
        </div>
      </div>

      {/* Live Menu Confirmation Popup */}
      {showLiveMenuConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4">Are you sure you want to set this menu as the Live Menu?</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setLiveMenu(menu.menuID)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
