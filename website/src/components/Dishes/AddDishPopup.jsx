import React from 'react';
import DishForm from './DishForm';
import { useAuth } from "../../context/AuthContext";
import { getUserRestaurantId } from "../../aws-config";

/**
 * Popup component for adding a new dish
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to close the popup
 * @param {Function} props.onSave - Function to handle saving the new dish
 */
const AddDishPopup = ({ onClose, onSave }) => {
  const { session } = useAuth();

  const handleSaveDish = (dishData) => {
    try {
      // Add additional fields needed for a new dish
      const restaurantId = getUserRestaurantId(session);
      const newDish = { 
        ...dishData,
        restaurantId,
        archive: false,
        sales: [],
        dishId: `${Date.now()}`, // Generate a unique ID
      };
      
      // Pass to parent component's save handler
      onSave(newDish);
      onClose();
    } catch (error) {
      console.error("Error preparing dish data:", error);
      alert("An error occurred while saving the dish. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">
          Add New Dish
        </div>
        
        <DishForm 
          onSave={handleSaveDish}
          onClose={onClose}
          mode="add"
        />
      </div>
    </div>
  );
};

export default AddDishPopup;