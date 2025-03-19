import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMenus from "../hooks/useMenus";
import useDishes from "../hooks/useDishes";
import MenuForm from "../components/Menus/MenuForm";
import DishSelectionPopup from "../components/Menus/DishSelectionPopup";
import DeleteButtonWithConfirmation from "../components/Common/DeleteButtonWithConfirmation";

/**
 * Page component for viewing and editing a specific menu
 */
const MenuPage = () => {
  const { menuID } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { menus, updateMenu, deleteMenu, loading: menusLoading } = useMenus(session);
  const { loading: dishesLoading } = useDishes(user, session);
  
  const [menu, setMenu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDishPopup, setShowDishPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!menusLoading && !dishesLoading) {
      const foundMenu = menus.find(m => m.menuID === menuID);
      if (foundMenu) {
        setMenu(foundMenu);
        setError(null);
      } else {
        setError("Menu not found.");
      }
      setLoading(false);
    }
  }, [menuID, menus, menusLoading, dishesLoading]);

  const handleSaveMenu = async (updatedMenu) => {
    try {
      await updateMenu(updatedMenu);
      setMenu(updatedMenu);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update menu:", error);
      setError("Failed to update menu. Please try again.");
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await deleteMenu(menuID);
      navigate("/menus/my-menus");
    } catch (error) {
      console.error("Failed to delete menu:", error);
      setError("Failed to delete menu. Please try again.");
    }
  };

  const handleUpdateDishes = async (selectedDishes) => {
    try {
      const updatedMenu = { ...menu, dishes: selectedDishes };
      await updateMenu(updatedMenu);
      setMenu(updatedMenu);
      setShowDishPopup(false);
    } catch (error) {
      console.error("Failed to update dishes:", error);
      setError("Failed to update dishes. Please try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => navigate("/my-menus")} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Menus
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate("/menus/my-menus")} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Menus
          </button>
          
          <div className="flex space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Menu Details
              </button>
            )}
            
            <DeleteButtonWithConfirmation
              onConfirm={handleDeleteMenu}
              message="Are you sure you want to delete this menu? This action cannot be undone."
              buttonText="Delete Menu"
              buttonClassName="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            />
          </div>
        </div>

        {/* Menu Details Form/Display */}
        {isEditing ? (
          <MenuForm 
            menu={menu} 
            onSave={handleSaveMenu}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold mb-2">{menu.name || menu.menuName}</h2>
              {menu.isLive && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  LIVE MENU
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{menu.description || "No description available."}</p>
            <p className="text-gray-500 text-sm">
              Created: {new Date(menu.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Dishes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Menu Dishes</h3>
            <button
              onClick={() => setShowDishPopup(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update Dishes
            </button>
          </div>

          {menu.dishes && menu.dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.dishes.map((dish) => (
                <div key={dish.dishId} className="border rounded-md p-4 shadow-sm">
                  <h4 className="font-bold">{dish.name}</h4>
                  <p className="text-gray-600 text-sm my-1">{dish.description}</p>
                  <p className="font-semibold">${dish.price?.toFixed(2) || "0.00"}</p>
                  
                  {dish.ingredients && dish.ingredients.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Ingredients:</p>
                      <p className="text-xs text-gray-600">
                        {dish.ingredients.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No dishes have been added to this menu yet.</p>
              <button
                onClick={() => setShowDishPopup(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Dishes
              </button>
            </div>
          )}
        </div>

        {/* Dish Selection Popup */}
        {showDishPopup && (
          <DishSelectionPopup
            onClose={() => setShowDishPopup(false)}
            onSelectDishes={handleUpdateDishes}
            selectedDishes={menu.dishes || []}
          />
        )}
      </div>
    </div>
  );
};

export default MenuPage;