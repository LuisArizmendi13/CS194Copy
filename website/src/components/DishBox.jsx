import React, { useState } from 'react';

const DishBox = ({ dish, onDishSelect, isSelected, isSelectable }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return dish ? (
    <div className={`border rounded p-4 flex justify-between items-center mb-4 shadow ${isSelected ? 'bg-blue-100' : ''}`}>
      <div>
        <div className="text-lg font-bold">{dish.name || "Unknown Dish"}</div>
        <div className="text-gray-600">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
        {showIngredients && (
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
            type="button" // ✅ Prevents accidental form submission
            onClick={() => onDishSelect(dish.dishId)} 
            className={`px-4 py-2 rounded ${isSelected ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isSelected ? "Deselect" : "Select"}
          </button>
        )}
        <button onClick={() => setShowIngredients(!showIngredients)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
      </div>
    </div>
  ) : null;
};

export default DishBox;
