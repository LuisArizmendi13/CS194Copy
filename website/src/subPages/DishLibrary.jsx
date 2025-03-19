import React from "react";
import AddDishPopup from "../components/AddDishPopup";

const DishLibrary = ({
  dishes,
  handleDeleteDish,
  addDish,
  showDishPopup,
  setShowDishPopup,
  showHelpText,
  setShowHelpText,
  InfoBox,
}) => {
  return (
    <div>
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

      {/* If no dishes, show empty state */}
      {dishes.length === 0 ? (
        <div className="bg-white p-4 rounded-md shadow-sm text-center">
          <p className="text-gray-600 mb-4">You haven't added any dishes yet.</p>
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
            <div key={dish.dishId} className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{dish.name}</h3>
                    {dish.category && (
                      <span className="text-xs text-gray-500">{dish.category}</span>
                    )}
                  </div>
                  <div className="text-base font-semibold text-green-700">
                    ${parseFloat(dish.price || 0).toFixed(2)}
                  </div>
                </div>

                {dish.description && (
                  <p className="text-gray-600 text-sm mt-2">{dish.description}</p>
                )}

                {dish.ingredients?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {dish.ingredients.slice(0, 3).join(", ")}
                      {dish.ingredients.length > 3 ? "..." : ""}
                    </p>
                  </div>
                )}

                {/* Edit/Delete buttons */}
                <div className="flex justify-between mt-3">
                  <button
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                    onClick={() => handleDeleteDish(dish.dishId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup for new dish if desired—handled in MenusPage */}
      {/* e.g. showDishPopup && <AddDishPopup ... /> */}
    </div>
  );
};

export default DishLibrary;
