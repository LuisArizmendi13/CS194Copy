import React, { useState } from 'react';

/**
 * A reusable form component for both adding and editing dishes
 */
const DishForm = ({ 
  initialDish = {}, 
  ingredientsList = [],
  onSave, 
  onClose 
}) => {
  const [name, setName] = useState(initialDish.name || "");
  const [description, setDescription] = useState(initialDish.description || "");
  const [price, setPrice] = useState(initialDish.price?.toString() || "");
  const [ingredient, setIngredient] = useState("");
  const [newIngredient, setNewIngredient] = useState("");
  const [ingredients, setIngredients] = useState(initialDish.ingredients || []);
  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }
    if (ingredients.length === 0) newErrors.ingredients = "At least one ingredient is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add ingredient to the list
  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      if (!ingredients.includes(newIngredient.trim())) {
        setIngredients([...ingredients, newIngredient.trim()]);
      }
      setNewIngredient("");
    } else if (ingredient.trim()) {
      if (!ingredients.includes(ingredient.trim())) {
        setIngredients([...ingredients, ingredient.trim()]);
      }
      setIngredient("");
    }

    // Clear the ingredients error if we now have ingredients
    if (errors.ingredients && ingredients.length > 0) {
      setErrors({ ...errors, ingredients: undefined });
    }
  };

  // Remove ingredient from the list
  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  // Save the dish data
  const handleSave = () => {
    if (!validateForm()) return;

    const dishData = {
      ...(initialDish.dishId ? { dishId: initialDish.dishId } : {}),
      name,
      description,
      price: parseFloat(price),
      ingredients
    };

    onSave(dishData);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Dish Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter dish name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter dish description"
          rows="3"
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          id="price"
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter price"
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ingredients
        </label>
        
        <div className="flex mb-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            className="flex-grow p-2 border rounded-l border-gray-300"
            placeholder="Add new ingredient"
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            disabled={!newIngredient.trim()}
          >
            Add
          </button>
        </div>

        <div className="mb-2">
          <select
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            className="w-full p-2 border rounded border-gray-300"
          >
            <option value="">Select from existing ingredients</option>
            {ingredientsList.map((ing, index) => (
              <option key={index} value={ing}>{ing}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className={`w-full bg-green-500 text-white px-4 py-2 rounded mb-2 ${!ingredient ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
          disabled={!ingredient}
        >
          Add Selected Ingredient
        </button>

        {errors.ingredients && (
          <p className="text-red-500 text-xs mb-2">{errors.ingredients}</p>
        )}

        {ingredients.length > 0 && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="font-medium text-sm mb-2">Current Ingredients:</p>
            <ul>
              {ingredients.map((ing, index) => (
                <li key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                  <span className="text-sm">{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {initialDish.dishId ? "Update Dish" : "Save Dish"}
        </button>
      </div>
    </div>
  );
};

export default DishForm;