import React from 'react';
import DishForm from './DishForm';

/**
 * Popup component for adding a new dish
 */
const AddDishPopup = ({ onClose, onSave, ingredientsList = [] }) => {
  const handleSave = async (dishData) => {
    const success = await onSave(dishData);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full max-h-screen overflow-auto">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold sticky top-0">
          Add New Dish
        </div>
        
        <DishForm
          ingredientsList={ingredientsList}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddDishPopup;