import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRestaurantId } from "../aws-config";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import DishSelectionPopup from "../components/Menus/DishSelectionPopup";
import { createMenu } from "../services/menuService";

const MenuCreationPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!menuName.trim()) {
      setErrorMessage("Please enter a menu name.");
      return;
    }

    const restaurantId = getUserRestaurantId(session);
    if (!restaurantId) {
      setErrorMessage("Error: No restaurant ID found. Please try logging in again.");
      return;
    }

    const newMenu = {
      menuID: `menu-${Date.now()}`,
      name: menuName.trim(),
      description: menuDescription.trim(),
      restaurantId,
      dishes: selectedDishes,
    };
    

    try {
      setIsSaving(true);
      await createMenu(newMenu);
      console.log("✅ Menu successfully saved: ", newMenu);
      console.log("Navigating to /mymenus");
      navigate("/mymenus");
    } catch (error) {
      console.error("❌ Error saving menu:", error);
      setErrorMessage("An error occurred while saving the menu. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Create a New Menu</h2>
      <p className="text-gray-600">Fill in the details to create your menu.</p>

      <form onSubmit={handleSubmit} className="mt-6 bg-white shadow-md p-4 rounded">
        {errorMessage && <p className="text-red-600 font-semibold mb-2">{errorMessage}</p>}

        <FormInput
          label="Menu Name"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Enter menu name"
        />

        <FormInput
          label="Menu Description"
          type="text"
          value={menuDescription}
          onChange={(e) => setMenuDescription(e.target.value)}
          placeholder="Enter menu description (optional)"
        />

        {/* Show Selected Dishes */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Selected Dishes:</h3>
          {selectedDishes.length > 0 ? (
            selectedDishes.map((dish) => (
              <p key={dish.dishId} className="text-gray-700">
                {dish.name}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No dishes selected.</p>
          )}
        </div>

        {/* Dish Selection Popup */}
        {showPopup && (
          <DishSelectionPopup
            onClose={() => setShowPopup(false)}
            onSelectDishes={setSelectedDishes}
            selectedDishes={selectedDishes}
          />
        )}

        {/* Buttons Section */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/mymenus")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Cancel
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log("Opening Dish Selection Popup");
                setShowPopup(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Select Dishes
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Menu"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MenuCreationPage;
