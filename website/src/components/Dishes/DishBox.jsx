import React, { useState } from 'react';
import { dynamoDb, TABLE_NAME } from '../../aws-config';
import DeleteButtonWithConfirmation from '../Common/DeleteButtonWithConfirmation'; // Adjusted import

const DishBox = ({ dish, onDishSelect, isSelected, isSelectable, onDelete }) => {
  const [showIngredients, setShowIngredients] = useState(false);
  console.log('DishBox received onDelete:', onDelete);  // Debug: Check in console

  return dish ? (
    <div className={`border rounded p-4 flex justify-between items-center mb-4 shadow ${isSelected ? 'bg-blue-100' : ''}`}>
      <div>
        <div className="text-lg font-bold">{dish.name || "Unknown Dish"}</div>
        {dish.description && (
          <div className="text-gray-500 italic text-sm mt-1">{dish.description}</div>
        )}
        <div className="text-gray-600">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
        {showIngredients && dish.ingredients && (
          <ul className="mt-2">
            {dish.ingredients.map((ing, index) => (
              <li key={index} className="text-sm text-gray-600">- {ing}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-4">
        {isSelectable && (
          <button 
            type="button"
            onClick={() => onDishSelect(dish.dishId)} 
            className={`px-4 py-2 rounded ${isSelected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isSelected ? "Deselect" : "Select"}
          </button>
        )}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
        {onDelete && (
          <DeleteButtonWithConfirmation
            onConfirm={async () => {
              try {
                await dynamoDb.delete({
                  TableName: TABLE_NAME,
                  Key: { dishId: dish.dishId }
                }).promise();
                console.log(`✅ Successfully deleted dish: ${dish.dishId}`);
                onDelete(dish.dishId);
              } catch (error) {
                console.error("❌ Error deleting dish:", error);
              }
            }}
            message="Are you sure you want to delete this dish?"
            buttonText="Delete"
          />
        )}
      </div>
    </div>
  ) : null;
};

export default DishBox;
