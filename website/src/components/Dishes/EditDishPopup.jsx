import React from 'react';
import DishForm from './DishForm';
import DeleteButtonWithConfirmation from '../Common/DeleteButtonWithConfirmation';

/**
 * Popup component for editing an existing dish
 */
const EditDishPopup = ({ dish, onClose, onSave, onDelete, ingredientsList = [] }) => {
  const handleSave = async (dishData) => {
    // Keep any existing fields not included in the form
    const updatedDish = {
      ...dish,
      ...dishData
    };
    
    const success = await onSave(updatedDish);
    if (success) {
      onClose();
    }
  };

  const handleDelete = async () => {
    const success = await onDelete(dish.dishId);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 max-w-full max-h-screen overflow-auto">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg flex justify-between items-center sticky top-0">
          <div className="text-lg font-bold">Edit Dish: {dish.name}</div>
          
          <DeleteButtonWithConfirmation
            onConfirm={handleDelete}
            message="Are you sure you want to delete this dish?"
            confirmText="Delete"
            cancelText="Cancel"
            buttonText="Delete"
            buttonClassName="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            modalClassName="z-[60]" 
          />
        </div>
        
        <DishForm 
          initialDish={dish}
          ingredientsList={ingredientsList}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default EditDishPopup;