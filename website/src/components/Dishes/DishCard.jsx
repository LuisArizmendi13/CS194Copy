import React, { useState } from 'react';
import DeleteButtonWithConfirmation from '../Common/DeleteButtonWithConfirmation';

/**
 * Card component for displaying dish information with actions
 */
const DishCard = ({ dish, showActions = false, onDelete, onEdit }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  if (!dish) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{dish.name}</h3>
        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(dish)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Edit
            </button>
            <DeleteButtonWithConfirmation
              onConfirm={() => onDelete(dish.dishId)}
              message="Are you sure you want to delete this dish?"
              buttonText="Delete"
              buttonClassName="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            />
          </div>
        )}
      </div>
      
      <p className="text-gray-700 text-sm mb-2">{dish.description}</p>
      <p className="font-semibold">${dish.price?.toFixed(2)}</p>
      
      <div className="mt-2">
        <button 
          onClick={() => setShowIngredients(!showIngredients)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
        
        {showIngredients && dish.ingredients && dish.ingredients.length > 0 && (
          <div className="mt-1">
            <p className="text-sm font-medium">Ingredients:</p>
            <ul className="text-xs text-gray-600 list-disc pl-5">
              {dish.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishCard;