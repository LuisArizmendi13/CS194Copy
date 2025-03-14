import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useDishes from '../hooks/useDishes';
import AddDishPopup from '../components/AddDishPopup';
import DishList from '../components/DishList';

const DishesPage = () => {
  const { user, session } = useAuth();
  const { dishes, loading, error, reload, handleDeleteDish, handleModifyDish } = useDishes(user, session);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const addDish = async (dish) => {
    // Existing functionality for adding a dish (unchanged)
  };

  const handleEditDish = (dish) => {
    setSelectedDish(dish);  // ✅ Store selected dish
    setShowPopup(true); // ✅ Open popup
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => {
            setSelectedDish(null); // Reset selection for new dish
            setShowPopup(true);
          }} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + New Dish
        </button>
      </div>

      {loading ? (
        <p>Loading dishes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <DishList dishes={dishes} onEdit={handleEditDish} onDelete={handleDeleteDish} />
      )}

      {showPopup && (
        <AddDishPopup
          dish={selectedDish} // ✅ Pre-fills the form when editing
          onClose={() => {
            setShowPopup(false);
            setSelectedDish(null);
          }}
          onSave={(updatedDish) => {
            if (selectedDish) {
              handleModifyDish(updatedDish); // ✅ Modify if editing
            } else {
              addDish(updatedDish); // ✅ Add if creating a new dish
            }
            setShowPopup(false);
            setSelectedDish(null);
          }}
        />
      )}
    </div>
  );
};

export default DishesPage;