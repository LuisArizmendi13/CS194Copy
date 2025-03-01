import React, { useState, useEffect } from 'react';
import { dynamoDb, TABLE_NAME } from '../aws-config';

const DishBox = ({ dish, onArchiveChange, onSaleRecorded }) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const [isArchived, setIsArchived] = useState(dish?.archive ?? false);
  const [salesCount, setSalesCount] = useState(dish.sales?.length || 0);

  useEffect(() => {
    setIsArchived(dish?.archive ?? false);
  }, [dish]);

  const handleArchiveChange = async (event) => {
    const newStatus = !event.target.checked;
    setIsArchived(newStatus);
    const params = {
      TableName: TABLE_NAME,
      Key: { dishId: dish.dishId },
      UpdateExpression: "set #archive = :archiveStatus",
      ExpressionAttributeNames: { "#archive": "archive" },
      ExpressionAttributeValues: { ":archiveStatus": newStatus },
      ReturnValues: "UPDATED_NEW"
    };
    try {
      await dynamoDb.update(params).promise();
      onArchiveChange(dish.dishId, newStatus);
    } catch (error) {
      console.error("Error updating archive status:", error);
    }
  };

  const recordSale = async () => {
    const sale = { time: new Date().toISOString(), price: dish.price };
    const updatedSales = [...(dish.sales || []), sale];

    const params = {
      TableName: TABLE_NAME,
      Key: { dishId: dish.dishId },
      UpdateExpression: "set sales = :sales",
      ExpressionAttributeValues: { ":sales": updatedSales },
      ReturnValues: "UPDATED_NEW"
    };

    try {
      await dynamoDb.update(params).promise();
      setSalesCount(updatedSales.length);
      onSaleRecorded(dish.dishId, updatedSales); // ✅ Correctly notify parent about sale update
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  return dish ? (
    <div className="border rounded p-4 flex justify-between items-center mb-4 shadow">
      <div>
        <div className="text-lg font-bold">{dish.name || "Unknown Dish"}</div>
        <div className="text-gray-600">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
        <div className="text-gray-600">Sales: {salesCount}</div>
        {showIngredients && (
          <ul className="mt-2">
            {dish.ingredients.map((ing, index) => (
              <li key={index} className="text-sm text-gray-600">- {ing}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button onClick={recordSale} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Record Sale</button>
        <label className="flex items-center">
          <input type="checkbox" checked={!isArchived} onChange={handleArchiveChange} className="mr-2" />
          Active
        </label>
        <button onClick={() => setShowIngredients(!showIngredients)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
      </div>
    </div>
  ) : null;
};

export default DishBox;
