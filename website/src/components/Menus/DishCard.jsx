import React from "react";

/**
 * Reusable card component for displaying dish information
 * Used in LiveMenuPage, DishesPage, and MenuCreationPage
 * 
 * @param {Object} props - Component props
 * @param {Object} props.dish - The dish object to display
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {Function} props.onDelete - Function to call when Delete button is clicked
 * @param {Function} props.onEdit - Function to call when Edit button is clicked
 * @param {Function} props.onAdd - Function to call when Add to Menu button is clicked
 */
const DishCard = ({ 
  dish, 
  showActions = false, 
  onDelete, 
  onEdit, 
  onAdd 
}) => {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {dish.name}
            </h3>
            {dish.category && (
              <span className="text-xs text-gray-500">
                {dish.category}
              </span>
            )}
          </div>
          <div className="text-base font-semibold text-green-700">
            ${parseFloat(dish.price || 0).toFixed(2)}
          </div>
        </div>

        {dish.description && (
          <p className="text-gray-600 text-sm mt-2">
            {dish.description}
          </p>
        )}

        {dish.ingredients?.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              {dish.ingredients.slice(0, 3).join(", ")}
              {dish.ingredients.length > 3 ? "..." : ""}
            </p>
          </div>
        )}

        {showActions && (
          <div className="flex justify-between mt-3">
            {onAdd && (
              <button
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => onAdd(dish)}
              >
                Add to Menu
              </button>
            )}
            {onEdit && (
              <button
                className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                onClick={() => onEdit(dish)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => onDelete(dish.dishId)}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DishCard;