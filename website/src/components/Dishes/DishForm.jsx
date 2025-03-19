import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { fetchIngredients } from "../../services/dishService";

const DishForm = ({ initialDish = {}, onSave, onClose, mode = "add" }) => {
  // Destructure auth context to get user session
  const { user, session } = useAuth();
  
  // Form state
  const [name, setName] = useState(initialDish.name || "");
  const [description, setDescription] = useState(initialDish.description || "");
  const [price, setPrice] = useState(initialDish.price?.toString() || "");
  const [ingredient, setIngredient] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredients, setIngredients] = useState(initialDish.ingredients || []);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing ingredients for suggestions
  useEffect(() => {
    const loadIngredients = async () => {
      if (!user || !session) return;
      
      try {
        setIsLoading(true);
        const loadedIngredients = await fetchIngredients(session);
        setIngredientsList([...new Set(loadedIngredients)].sort());
      } catch (error) {
        console.error("Failed to load ingredients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadIngredients();
  }, [user, session]);

  // Add an ingredient to the dish
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      if (!ingredientsList.includes(newIngredient.trim())) {
        setIngredientsList([...ingredientsList, newIngredient.trim()].sort());
      }
      if (!ingredients.includes(newIngredient.trim())) {
        setIngredients([...ingredients.filter(ing => ing.trim() !== ''), newIngredient.trim()]);
      }
      setNewIngredient("");
    } else if (ingredient.trim()) {
      if (!ingredients.includes(ingredient.trim())) {
        setIngredients([...ingredients.filter(ing => ing.trim() !== ''), ingredient.trim()]);
      }
      setIngredient("");
    }
  };

  // Handle form submission
  const handleSave = () => {
    // Validate form
    if (!name || !description || !price || ingredients.length === 0) {
      alert("Please fill in all fields and add at least one ingredient.");
      return;
    }

    // Create dish object
    const dishData = { 
      ...(initialDish.dishId ? { dishId: initialDish.dishId } : {}), // Include ID if editing
      name,
      description,
      price: parseFloat(price),
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
    };

    // Call the provided onSave callback with dish data
    onSave(dishData);
  };

  return (
    <div className="p-4">
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter dish name" 
        className="w-full p-2 border rounded mb-2" 
      />
      
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Enter dish description" 
        className="w-full p-2 border rounded mb-2"
      ></textarea>
      
      <input 
        type="text" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="Enter price" 
        className="w-full p-2 border rounded mb-2" 
      />
      
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={newIngredient} 
          onChange={(e) => setNewIngredient(e.target.value)} 
          placeholder="Enter new ingredient" 
          className="flex-1 p-2 border rounded" 
        />
        
        <button 
          onClick={handleAddIngredient} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>
      
      <div className="mb-4">
        <select 
          value={ingredient} 
          onChange={(e) => setIngredient(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="">Select from existing ingredients</option>
          {ingredientsList.map((ing, index) => (
            <option key={index} value={ing}>{ing}</option>
          ))}
        </select>
        
        <button 
          onClick={handleAddIngredient} 
          disabled={!ingredient} 
          className={`w-full bg-green-500 text-white px-4 py-2 rounded ${!ingredient ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
        >
          Add Selected Ingredient
        </button>
      </div>
      
      {ingredients.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-1">Ingredients:</h3>
          <ul className="bg-gray-50 p-2 rounded border">
            {ingredients.map((ing, index) => (
              <li key={index} className="text-sm text-gray-600 flex justify-between items-center py-1">
                <span>- {ing}</span>
                <button 
                  onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex justify-end gap-4 mt-4">
        <button 
          onClick={onClose} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {mode === "edit" ? "Update Dish" : "Save Dish"}
        </button>
      </div>
    </div>
  );
};

export default DishForm;