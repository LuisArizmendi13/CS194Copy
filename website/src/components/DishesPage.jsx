import React, { useState } from 'react';
import { Dish } from '../classes/dish'; // Adjust import path if needed

// Input Component
const InputField = ({ label, value, setValue, placeholder }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border rounded"
    />
  </div>
);

// Popup Component
const AddDishPopup = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const saveDish = () => {
    if (name && price && ingredients.length > 0) {
      const dish = new Dish(name, parseFloat(price), ingredients);
      onSave(dish);
      onClose();
    } else {
      alert("Please fill in all fields and add at least one ingredient.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">Add New Dish</div>
        <div className="p-4">
          <InputField label="Dish Name" value={name} setValue={setName} placeholder="Enter dish name" />
          <InputField label="Price" value={price} setValue={setPrice} placeholder="Enter price" />
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Ingredients</label>
            <div className="flex">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="Enter ingredient"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={addIngredient}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {ingredients.map((ing, index) => (
                <li key={index} className="text-sm text-gray-600">- {ing}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              onClick={saveDish}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dish Box Component
const DishBox = ({ dish }) => {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="border rounded p-4 flex justify-between items-center mb-4 shadow">
      <div>
        <div className="text-lg font-bold">{dish.name}</div>
        <div className="text-gray-600">${dish.price.toFixed(2)}</div>
        {showIngredients && (
          <ul className="mt-2">
            {dish.ingredients.map((ing, index) => (
              <li key={index} className="text-sm text-gray-600">- {ing}</li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={() => setShowIngredients(!showIngredients)}
        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
      >
        {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
      </button>
    </div>
  );
};

// Dishes Page Component
const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const addDish = (dish) => {
    setDishes([...dishes, dish]);
  };

  return (
    <div className="p-6" className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <button onClick={() => setShowPopup(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6 float-right block"
      >
        + New Dish
      </button>
      <div style={{ clear: 'both' }}></div>{dishes.map((dish, index) => (
        <DishBox key={index} dish={dish} />
      ))}
      {showPopup && (
        <AddDishPopup onClose={() => setShowPopup(false)} onSave={addDish} />
      )}
    </div>
  );
};

export default DishesPage;
