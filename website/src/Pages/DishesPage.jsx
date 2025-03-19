// src/Pages/DishesPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useDishes from "../hooks/useDishes";
import InfoBox from "../components/InfoBox";
import MenuNav from "../components/Menus/MenuNav";
import DishCard from "../components/Menus/DishCard";
import AddDishPopup from "../components/Dishes/AddDishPopup";
import EditDishPopup from "../components/Dishes/EditDishPopup"; // Import the new component

/**
 * Page component for managing dishes in the dish library
 */
const DishesPage = () => {
  const { user, session } = useAuth();
  const { 
    dishes, 
    handleModifyDish, 
    handleDeleteDish, 
    loading: dishesLoading, 
    addDish 
  } = useDishes(user, session);
  
  const [showHelpText, setShowHelpText] = useState(true);
  const [showDishPopup, setShowDishPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [dishToEdit, setDishToEdit] = useState(null);

  if (dishesLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-700">
        Redirecting to Sign In...
      </div>
    );
  }
  
  // Handler for the edit button click
  const handleEditClick = (dish) => {
    setDishToEdit(dish);
    setShowEditPopup(true);
  };
  
  // Handler for saving edited dish
  const handleSaveEdit = (updatedDish) => {
    // Pass directly to the hook's handleModifyDish function
    handleModifyDish(updatedDish);
    setShowEditPopup(false);
    setDishToEdit(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <MenuNav />

        {/* Help text */}
        {showHelpText && (
          <InfoBox
            title="Your Dish Library"
            onClose={() => setShowHelpText(false)}
          >
            <p className="text-gray-600">
              This is your repository of all dishes. Create dishes here with
              descriptions, prices and ingredients before adding them to
              your menus.
            </p>
          </InfoBox>
        )}

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Dish Library</h1>
          <button
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => setShowDishPopup(true)}
          >
            + New Dish
          </button>
        </div>

        {dishes.length === 0 ? (
          <div className="bg-white p-4 rounded-md shadow-sm text-center">
            <p className="text-gray-600 mb-4">
              You haven't added any dishes yet.
            </p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => setShowDishPopup(true)}
            >
              Add Your First Dish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <DishCard
                key={dish.dishId}
                dish={dish}
                showActions={true}
                onDelete={handleDeleteDish}
                onEdit={handleEditClick}
                // onAdd prop is removed completely
              />
            ))}
          </div>
        )}

        {/* Add Dish Popup */}
        {showDishPopup && (
          <AddDishPopup
            onClose={() => setShowDishPopup(false)}
            onSave={addDish}
          />
        )}
        
        {/* Edit Dish Popup */}
        {showEditPopup && dishToEdit && (
          <EditDishPopup
            dish={dishToEdit}
            onClose={() => {
              setShowEditPopup(false);
              setDishToEdit(null);
            }}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default DishesPage;