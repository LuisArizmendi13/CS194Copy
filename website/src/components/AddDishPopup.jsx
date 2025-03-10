import React, { useState } from 'react';
import { dynamoDb, TABLE_NAME } from '../aws-config';

const AddDishPopup = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // ✅ New Description Field
  const [price, setPrice] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const saveDish = async () => {
    if (name && description && price && ingredients.length > 0) {
      const dish = { 
        name, 
        description, // ✅ Include description
        price: parseFloat(price), 
        ingredients, 
        archive: false, 
        sales: [], 
        dishId: `${Date.now()}` 
      };
      
      try {
        await dynamoDb.put({ TableName: TABLE_NAME, Item: dish }).promise();
        onSave(dish);
        onClose();
      } catch (error) {
        console.error("Error saving dish to DynamoDB:", error);
      }
    } else {
      alert("Please fill in all fields and add at least one ingredient.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">Add New Dish</div>
        <div className="p-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter dish name" className="w-full p-2 border rounded mb-2" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter dish description" className="w-full p-2 border rounded mb-2"></textarea> {/* ✅ New Textarea for Description */}
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="w-full p-2 border rounded mb-2" />
          <input type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Enter ingredient" className="w-full p-2 border rounded mb-2" />
          <button onClick={addIngredient} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Ingredient</button>
          <ul className="mt-2">{ingredients.map((ing, index) => <li key={index} className="text-sm text-gray-600">- {ing}</li>)}</ul>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
            <button onClick={saveDish} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDishPopup;
