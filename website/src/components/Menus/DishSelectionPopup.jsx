import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDishes from "../../hooks/useDishes";
import SelectableDishList from "../SelectableDishList";

const DishSelectionPopup = ({ onClose, onSelectDishes, selectedDishes }) => {
  const { user, session } = useAuth();
  const { dishes, loading, error } = useDishes(user, session);
  // Initialize local selected state with the dishIds from selectedDishes
  const [selected, setSelected] = useState(new Set(selectedDishes.map(dish => dish.dishId)));

  const toggleSelection = (dishId) => {
    setSelected(prevSelected => {
      const newSelection = new Set(prevSelected);
      if (newSelection.has(dishId)) {
        newSelection.delete(dishId);
      } else {
        newSelection.add(dishId);
      }
      return newSelection;
    });
  };

  const handleSave = () => {
    // Filter the fetched dishes to only those with IDs in the selected set
    const selectedDishesList = dishes.filter(dish => selected.has(dish.dishId));
    onSelectDishes(selectedDishesList);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Select Dishes</h2>
        {loading ? (
          <p>Loading dishes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <SelectableDishList 
            dishes={dishes} 
            onDishSelect={toggleSelection} 
            selectedDishes={selected} 
          />
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
            Update Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishSelectionPopup;
