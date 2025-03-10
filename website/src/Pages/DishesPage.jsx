import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useDishes from '../hooks/useDishes';
import AddDishPopup from '../components/AddDishPopup';
import DishList from '../components/DishList';

const DishesPage = () => {
  const { user, session } = useAuth();
  const { dishes, loading, error, reload } = useDishes(user, session);
  const [showPopup, setShowPopup] = useState(false);

  const addDish = async (dish) => {
    // Existing functionality for adding a dish (unchanged)
  };

  const handleDeleteDish = (deletedDishId) => {
    // Either reload or update state locally
    reload();
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowPopup(true)} 
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
        <DishList dishes={dishes} onDelete={handleDeleteDish} />
      )}

      {showPopup && <AddDishPopup onClose={() => setShowPopup(false)} onSave={addDish} />}
    </div>
  );
};

export default DishesPage;
