import React from "react";
import { getCategories, getFilteredDishes } from "../utils/menuHelpers";

const LiveMenu = ({
  liveMenu,
  categories,
  filteredDishes,
  selectedCategory,
  setSelectedCategory,
  showHelpText,
  setShowHelpText,
  navigate,
  InfoBox,
}) => {
  if (!liveMenu) {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm text-center">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-3">
          {/* Icon */}
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                 M9 5a2 2 0 002 2h2a2 2 0 002-2
                 M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">No live menu is set</h2>
        <p className="text-gray-600 mb-4">You haven't activated a menu yet. Select a menu to make it live.</p>
        {/* If menus exist, go to My Menus, otherwise prompt them to create a menu */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          onClick={() => navigate("/create-menu")}
        >
          Create Your First Menu
        </button>
      </div>
    );
  }

  return (
    <div>
      {showHelpText && (
        <InfoBox title="Welcome to Your Live Menu" onClose={() => setShowHelpText(false)}>
          <p className="text-gray-600">
            This is where you manage the menu that's currently visible to
            your customers. From here, you can view active items, export
            your menu, and make quick adjustments.
          </p>
        </InfoBox>
      )}

      {/* Live Menu Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 bg-white p-4 rounded-md shadow-sm">
        <div>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 mr-2">
              {liveMenu.name || "Current Menu"}
            </h1>
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse mr-1"></div>
              <span>Live</span>
            </div>
          </div>
          {liveMenu.description && (
            <p className="text-gray-600 text-sm mt-1">{liveMenu.description}</p>
          )}
        </div>

        <div className="mt-3 sm:mt-0 flex space-x-2">
          <button
            className="px-3 py-1.5 text-sm border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
            onClick={() => window.print()}
          >
            Export
          </button>
          <button
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate(`/menus/${liveMenu.menuID}`)}
          >
            Edit Menu
          </button>
        </div>
      </div>

      {/* Categories */}
      {categories && categories.length > 1 && (
        <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-1.5 rounded-full mr-2 whitespace-nowrap text-sm ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              } shadow-sm transition`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All Items" : category}
            </button>
          ))}
        </div>
      )}

      {/* Menu Items */}
      {filteredDishes.length === 0 ? (
        <div className="bg-white p-4 rounded-md shadow-sm text-center">
          <p className="text-gray-600 mb-4">
            No dishes have been added to this menu yet.
          </p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => setSelectedCategory("dishes")}
          >
            Add Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => (
            <div
              key={dish.dishId}
              className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {dish.name}
                    </h3>
                    {dish.category && (
                      <span className="text-xs text-gray-500">{dish.category}</span>
                    )}
                  </div>
                  <div className="text-base font-semibold text-green-700">
                    ${parseFloat(dish.price || 0).toFixed(2)}
                  </div>
                </div>

                {dish.description && (
                  <p className="text-gray-600 text-sm mt-2">
                    {dish.description}
                  </p>
                )}
                {dish.ingredients?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {dish.ingredients.slice(0, 3).join(", ")}
                      {dish.ingredients.length > 3 ? "..." : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveMenu;
