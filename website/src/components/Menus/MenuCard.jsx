import React from "react";
import DeleteButtonWithConfirmation from "../Common/DeleteButtonWithConfirmation";

/**
 * Reusable card component for displaying menu information
 * Styled consistently with DishCard
 */
const MenuCard = ({ menu, onEdit, onDelete, onSetLive }) => {
  if (!menu) return null;
  
  const dishCount = menu.dishes?.length || 0;
  const menuId = menu.menuID || menu.id;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{menu.name || menu.menuName}</h3>
        {menu.isLive && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            LIVE
          </span>
        )}
      </div>
      
      <p className="text-gray-700 text-sm mb-2">
        {menu.description || "No description available."}
      </p>
      
      <p className="text-gray-500 text-xs mb-3">
        {dishCount} {dishCount === 1 ? "dish" : "dishes"} • Created: {new Date(menu.createdAt || Date.now()).toLocaleDateString()}
      </p>
      
      <div className="flex justify-between items-center mt-4">
        {/* Left side - Set Live button */}
        <div>
          {!menu.isLive && onSetLive && (
            <button
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              onClick={() => onSetLive(menuId)}
            >
              Set Live
            </button>
          )}
        </div>
        
        {/* Right side - Edit and Delete buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(menuId)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            Edit
          </button>
          
          <DeleteButtonWithConfirmation
            onConfirm={() => onDelete(menuId)}
            message="Are you sure you want to delete this menu?"
            buttonText="Delete"
            buttonClassName="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuCard;