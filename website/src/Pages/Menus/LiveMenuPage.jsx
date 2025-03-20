import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useMenus from "../../hooks/useMenus";
import InfoBox from "../../components/Common/InfoBox";
import MenuNav from "../../components/Menus/MenuNav";
import DishCard from "../../components/Dishes/DishCard";
import { getCategories, getFilteredDishes } from "../../utils/menuHelpers";

/**
 * Page component for viewing and managing the live menu
 */
const LiveMenuPage = () => {
  const { user, session } = useAuth();
  const { liveMenu, loading: menusLoading } = useMenus(session);
  const [showHelpText, setShowHelpText] = useState(true);  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  if (menusLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-700">
        Redirecting to Sign In...
      </div>
    );
  }

  const handleEditMenu = (menuID) => {
    navigate(`/menus/${menuID}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <MenuNav />

        {showHelpText && (
          <InfoBox
            title="Welcome to Your Live Menu"
            onClose={() => setShowHelpText(false)}
          >
            <p className="text-gray-600">
              This is where you manage the menu that's currently visible to
              your customers. From here, you can view active items, export
              your menu, and make quick adjustments.
            </p>
          </InfoBox>
        )}

        {!liveMenu ? (
          <div className="bg-white p-4 rounded-md shadow-sm text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-3">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              No live menu is set
            </h2>
            <p className="text-gray-600 mb-4">
              You haven't activated a menu yet. Select a menu to make it
              live.
            </p>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              onClick={() => navigate("/menus/my-menus")}
            >
              Go to My Menus
            </button>
          </div>
        ) : (
          <>
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
                  <p className="text-gray-600 text-sm mt-1">
                    {liveMenu.description}
                  </p>
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
                  onClick={() => handleEditMenu(liveMenu.menuID)}
                >
                  Edit Menu
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            {getCategories(liveMenu).length > 1 && (
              <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {getCategories(liveMenu).map((category) => (
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
            {getFilteredDishes(liveMenu, selectedCategory).length === 0 ? (
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <p className="text-gray-600 mb-4">
                  No dishes have been added to this menu yet.
                </p>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  onClick={() => navigate("/menus/dish-library")}
                >
                  Add Dishes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredDishes(liveMenu, selectedCategory).map((dish) => (
                  <DishCard key={dish.dishId} dish={dish} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LiveMenuPage;