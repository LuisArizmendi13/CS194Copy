import React, { useState, useEffect } from 'react';
import { dynamoDb, TABLE_NAME, INGREDIENT_TABLE_NAME, getUserRestaurantId} from '../aws-config';
import useFetchIngredients from './useFetchIngredients'; // Import the useFetchIngredients hook
import { useAuth } from '../context/AuthContext';

const AddDishPopup = ({ onClose, onSave }) => {
    const { existingIngredients, loading } = useFetchIngredients(); // Use the hook to fetch ingredients
    const { session } = useAuth();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");

    const addIngredient = () => {
        if (selectedIngredient) {
            setIngredients([...ingredients, selectedIngredient]);
            setSelectedIngredient("");
        }
    };

    const saveDish = async () => {
        if (name && description && price && ingredients.length > 0) {
            const dish = { 
                name, 
                description, 
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

    const addNewIngredient = async () => {
      if (newIngredient.trim()) {
          try {
              const restaurantId = getUserRestaurantId(session);
              if (!restaurantId) {
                  console.error("No restaurant ID found.");
                  return;
              }
  
              const ingredientId = `${Date.now()}`; // Generate a unique ID
              const params = {
                  TableName: INGREDIENT_TABLE_NAME,
                  Item: {
                      IngredientId: ingredientId,
                      name: newIngredient.trim(),
                      restaurantId: restaurantId
                  }
              };
  
              await dynamoDb.put(params).promise();
              alert("Ingredient added successfully.");
              setNewIngredient("");
              window.location.reload(); // Reload to fetch the new ingredient
          } catch (error) {
              console.error("Error adding new ingredient:", error);
              alert("Failed to add ingredient. Please try again.");
          }
      }
  };
  
  
  

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
                <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">Add New Dish</div>
                <div className="p-4">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter dish name" className="w-full p-2 border rounded mb-2" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter dish description" className="w-full p-2 border rounded mb-2"></textarea>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="w-full p-2 border rounded mb-2" />
                    {loading ? (
                        <div>Loading ingredients...</div>
                    ) : (
                        <select value={selectedIngredient} onChange={(e) => setSelectedIngredient(e.target.value)} className="w-full p-2 border rounded mb-2">
                            <option value="">Select Ingredient</option>
                            {existingIngredients.map((ingredient) => (
                                <option key={ingredient} value={ingredient}>{ingredient}</option>
                            ))}
                        </select>
                    )}
                    <button onClick={addIngredient} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Ingredient</button>
                    <ul className="mt-2">{ingredients.map((ing, index) => <li key={index} className="text-sm text-gray-600">- {ing}</li>)}</ul>
                    <div className="mt-4">
                        <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="Enter new ingredient" className="w-full p-2 border rounded mb-2" />
                        <button onClick={addNewIngredient} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add New Ingredient</button>
                    </div>
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
