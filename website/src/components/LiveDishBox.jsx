import React, { useState } from 'react';

const LiveDishBox = ({ dish }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="border rounded p-4 flex justify-between items-center mb-4 shadow">
      <div>
        <div className="text-lg font-bold">{dish.name || "Unnamed Dish"}</div>
        <div className="text-gray-600">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
        {showIngredients && (
          <ul className="mt-2">
            {dish.ingredients.map((ing, index) => (
              <li key={index} className="text-sm text-gray-600">- {ing}</li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={() => setShowIngredients(!showIngredients)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
        {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
      </button>
    </div>
  );
};

export default LiveDishBox;
