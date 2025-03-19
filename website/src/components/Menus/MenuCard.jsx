import React from "react";

/**
 * Reusable card component for displaying menu information
 * Used in MyMenusPage and potentially other menu-related pages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.menu - The menu object to display
 * @param {Function} props.onEdit - Function to call when Edit button is clicked
 * @param {Function} props.onDelete - Function to call when Delete button is clicked
 * @param {Function} props.onSetLive - Function to call when Set Live button is clicked
 */
const MenuCard = ({ menu, onEdit, onDelete, onSetLive }) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-gray-800">{menu.name}</h3>
          {menu.isLive && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              LIVE
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-2">
          {menu.description || "No description available."}
        </p>

        <p className="text-gray-500 text-xs mb-3">
          Created: {new Date(menu.createdAt || Date.now()).toLocaleDateString()}
        </p>

        <div className="flex justify-between">
          <button
            className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
            onClick={() => onEdit(menu.menuID)}
          >
            Edit
          </button>
          <div className="flex items-center space-x-2">
            {!menu.isLive && onSetLive && (
              <button
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => onSetLive(menu.menuID)}
              >
                Set Live
              </button>
            )}

            <button
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => onDelete(menu.menuID)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;