import React from 'react';
import DishForm from './DishForm';

/**
 * Popup component for editing an existing dish
 * @param {Object} props - Component props
 * @param {Object} props.dish - The dish to edit
 * @param {Function} props.onClose - Function to close the popup
 * @param {Function} props.onSave - Function to handle saving the edited dish
 */
const EditDishPopup = ({ dish, onClose, onSave }) => {
  const handleSaveEdit = (updatedDishData) => {
    try {
      // Preserve fields that shouldn't be modified during edit
      const updatedDish = {
        ...dish, // Keep original fields like creation timestamp, sales history, etc.
        ...updatedDishData, // Override with updated fields
      };
      
      // Pass to parent component's save handler
      onSave(updatedDish);
    } catch (error) {
      console.error("Error preparing updated dish data:", error);
      alert("An error occurred while updating the dish. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">
          Edit Dish: {dish.name}
        </div>
        
        <DishForm 
          initialDish={dish}
          onSave={handleSaveEdit}
          onClose={onClose}
          mode="edit"
        />
      </div>
    </div>
  );
};

export default EditDishPopup;