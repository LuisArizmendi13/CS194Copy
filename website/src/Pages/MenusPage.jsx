import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  dynamoDb,
  MENUS_TABLE_NAME,
  TABLE_NAME,
  getUserRestaurantId,
} from "../aws-config";
import { useNavigate, useLocation } from "react-router-dom";
import AddDishPopup from "../components/AddDishPopup";

const MenusPage = () => {
  const { user, session } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const [menus, setMenus] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [liveMenu, setLiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDishPopup, setShowDishPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showHelpText, setShowHelpText] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for URL parameters
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get("tab");

  // Get unique categories from menu items
  const getCategories = () => {
    if (!liveMenu || !liveMenu.dishes) return [];

    const categoriesSet = new Set(
      liveMenu.dishes.map((dish) => dish.category || "Uncategorized")
    );
    return ["all", ...Array.from(categoriesSet)];
  };

  // Filter dishes by selected category
  const getFilteredDishes = () => {
    if (!liveMenu || !liveMenu.dishes) return [];
    if (selectedCategory === "all") return liveMenu.dishes;
    return liveMenu.dishes.filter((dish) => dish.category === selectedCategory);
  };

  useEffect(() => {
    // Set active tab based on URL parameter if present
    if (tabParam) {
      if (
        tabParam === "live" ||
        tabParam === "menus" ||
        tabParam === "dishes"
      ) {
        setActiveTab(tabParam);
      }
    }
  }, [tabParam]);

  useEffect(() => {
    if (!user || !session) return;

    const fetchData = async () => {
      try {
        const restaurantId = getUserRestaurantId(session);
        if (!restaurantId) {
          console.warn("❌ No restaurantId found!");
          setLoading(false);
          return;
        }

        // Fetch menus
        const menuParams = {
          TableName: MENUS_TABLE_NAME,
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId },
        };

        const menuData = await dynamoDb.scan(menuParams).promise();
        const menusArray = menuData.Items || [];
        setMenus(menusArray);

        // Fetch dishes
        const dishParams = {
          TableName: TABLE_NAME,
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId },
        };

        const dishData = await dynamoDb.scan(dishParams).promise();
        setDishes(dishData.Items || []);

        // Find the live menu if any
        const liveMenuID = sessionStorage.getItem("liveMenuID");
        const currentLiveMenu =
          menusArray.find((menu) => menu.menuID === liveMenuID) ||
          menusArray.find((menu) => menu.isLive);
        setLiveMenu(currentLiveMenu);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, session]);

  const addDish = async (dish) => {
    try {
      const restaurantId = getUserRestaurantId(session);
      if (!restaurantId) {
        console.error("❌ Cannot save dish: No restaurantId found!");
        return;
      }

      const dishWithRestaurant = { ...dish, restaurantId };

      // Save to dishes table
      await dynamoDb
        .put({
          TableName: TABLE_NAME,
          Item: dishWithRestaurant,
        })
        .promise();

      // Also add to current live menu if one exists
      if (liveMenu) {
        const updatedMenu = {
          ...liveMenu,
          dishes: [...(liveMenu.dishes || []), dishWithRestaurant],
        };

        await dynamoDb
          .put({
            TableName: MENUS_TABLE_NAME,
            Item: updatedMenu,
          })
          .promise();

        setLiveMenu(updatedMenu);

        // Update menus array
        setMenus(
          menus.map((menu) =>
            menu.menuID === updatedMenu.menuID ? updatedMenu : menu
          )
        );
      }

      setDishes([...dishes, dishWithRestaurant]);
    } catch (error) {
      console.error("Error saving dish:", error);
    }
  };

  const setMenuAsLive = async (menuId) => {
    try {
      // First, unset the current live menu
      if (liveMenu) {
        const currentLiveMenuUpdated = { ...liveMenu, isLive: false };
        await dynamoDb
          .put({
            TableName: MENUS_TABLE_NAME,
            Item: currentLiveMenuUpdated,
          })
          .promise();
      }

      // Set the new menu as live
      const newLiveMenu = menus.find((menu) => menu.menuID === menuId);
      if (newLiveMenu) {
        const updatedMenu = { ...newLiveMenu, isLive: true };
        await dynamoDb
          .put({
            TableName: MENUS_TABLE_NAME,
            Item: updatedMenu,
          })
          .promise();

        // Update state
        setLiveMenu(updatedMenu);
        setMenus(
          menus.map((menu) =>
            menu.menuID === menuId ? updatedMenu : { ...menu, isLive: false }
          )
        );

        // Store live menu ID in session storage
        sessionStorage.setItem("liveMenuID", menuId);

        // Trigger event to update other components
        window.dispatchEvent(new Event("liveMenuUpdated"));
      }
    } catch (error) {
      console.error("Error setting menu as live:", error);
    }
  };

  const handleEditMenu = (menuID) => {
    // Navigate to the edit page for this specific menu
    navigate(`/menus/${menuID}`);
  };

  if (!user) {
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-700">
        Redirecting to Sign In...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Helper component for the "X" close button
  const CloseButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );

  // Info tooltip component (smaller & cleaner)
  const InfoBox = ({ title, children, onClose }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative border-l-4 border-blue-500 text-sm">
      <CloseButton onClick={onClose} />
      <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-base font-medium ${
                activeTab === "live"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("live")}
            >
              Live Menu
            </button>
            <button
              className={`px-4 py-2 text-base font-medium ${
                activeTab === "menus"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("menus")}
            >
              My Menus
            </button>
            <button
              className={`px-4 py-2 text-base font-medium ${
                activeTab === "dishes"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("dishes")}
            >
              Dish Library
            </button>
          </div>
        </div>

        {/* Live Menu Tab Content */}
        {activeTab === "live" && (
          <div>
            {/* Help text - smaller and with X */}
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

                {menus.length > 0 ? (
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    onClick={() => setActiveTab("menus")}
                  >
                    Go to My Menus
                  </button>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      You don't have any menus yet. Let's create one!
                    </p>
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => navigate("/create-menu")}
                    >
                      Create Your First Menu
                    </button>
                  </div>
                )}
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
                {getCategories().length > 1 && (
                  <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
                    {getCategories().map((category) => (
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
                {getFilteredDishes().length === 0 ? (
                  <div className="bg-white p-4 rounded-md shadow-sm text-center">
                    <p className="text-gray-600 mb-4">
                      No dishes have been added to this menu yet.
                    </p>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      onClick={() => setActiveTab("dishes")}
                    >
                      Add Dishes
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredDishes().map((dish) => (
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
                                <span className="text-xs text-gray-500">
                                  {dish.category}
                                </span>
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
              </>
            )}
          </div>
        )}

        {/* My Menus Tab Content */}
        {activeTab === "menus" && (
          <div>
            {/* Help text */}
            {showHelpText && (
              <InfoBox
                title="Your Menu Library"
                onClose={() => setShowHelpText(false)}
              >
                <p className="text-gray-600">
                  Here you can manage all your restaurant's menus, create
                  seasonal or special event menus, set a menu as "Live", and
                  utilize AI-optimization based on sales data.
                </p>
              </InfoBox>
            )}

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">My Menus</h1>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => navigate("/create-menu")}
                >
                  + New Menu
                </button>
                <button className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition">
                  AI Generate
                </button>
              </div>
            </div>

            {dishes.length === 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 text-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      You need to add dishes before your menus can be useful.
                    </p>
                    <button
                      onClick={() => setActiveTab("dishes")}
                      className="mt-1 inline-flex items-center px-2 py-1 text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
                    >
                      Add Dishes Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {menus.length === 0 ? (
              <div className="bg-white p-4 rounded-md shadow-sm text-center">
                <p className="text-gray-600 mb-4">
                  You haven't created any menus yet.
                </p>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => navigate("/create-menu")}
                >
                  Create Your First Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu) => (
                  <div
                    key={menu.menuID}
                    className="bg-white rounded-md shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800">
                          {menu.name}
                        </h3>
                        {menu.isLive && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            LIVE
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        {menu.description || "No description available."}
                      </p>

                      <p className="text-gray-500 text-xs mb-3">
                        Created:{" "}
                        {new Date(
                          menu.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </p>

                      <div className="flex justify-between">
                        <button
                          className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                          onClick={() => handleEditMenu(menu.menuID)}
                        >
                          Edit
                        </button>
                        {!menu.isLive && (
                          <button
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => setMenuAsLive(menu.menuID)}
                          >
                            Set Live
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dishes Tab Content */}
        {activeTab === "dishes" && (
          <div>
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
                  <div
                    key={dish.dishId}
                    className="bg-white rounded-md shadow-sm overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">
                            {dish.name}
                          </h3>
                          {dish.category && (
                            <span className="text-xs text-gray-500">
                              {dish.category}
                            </span>
                          )}
                        </div>
                        <div className="text-base font-semibold text-green-700">
                          ${parseFloat(dish.price || 0).toFixed(2)}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        {dish.description || "No description available."}
                      </p>

                      {dish.ingredients?.length > 0 && (
                        <div className="mt-2 mb-3">
                          <h4 className="text-xs font-medium text-gray-700 mb-1">
                            Ingredients:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {dish.ingredients?.map((ing, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between mt-2">
                        <button className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition">
                          Edit
                        </button>
                        {liveMenu && (
                          <button
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                            onClick={() => {
                              // Add to live menu functionality
                              if (!liveMenu.dishes) {
                                liveMenu.dishes = [];
                              }

                              // Check if dish is already in the menu
                              const isDishInMenu = liveMenu.dishes.some(
                                (d) => d.dishId === dish.dishId
                              );

                              if (!isDishInMenu) {
                                const updatedMenu = {
                                  ...liveMenu,
                                  dishes: [...liveMenu.dishes, dish],
                                };

                                dynamoDb
                                  .put({
                                    TableName: MENUS_TABLE_NAME,
                                    Item: updatedMenu,
                                  })
                                  .promise()
                                  .then(() => {
                                    setLiveMenu(updatedMenu);
                                    setMenus(
                                      menus.map((m) =>
                                        m.menuID === updatedMenu.menuID
                                          ? updatedMenu
                                          : m
                                      )
                                    );
                                    alert(
                                      `${dish.name} added to ${liveMenu.name}`
                                    );
                                  })
                                  .catch((err) => {
                                    console.error(
                                      "Error adding dish to menu:",
                                      err
                                    );
                                    alert("Error adding dish to menu");
                                  });
                              } else {
                                alert(`${dish.name} is already in the menu`);
                              }
                            }}
                          >
                            Add to Menu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Dish Popup */}
      {showDishPopup && (
        <AddDishPopup
          onClose={() => setShowDishPopup(false)}
          onSave={addDish}
        />
      )}
    </div>
  );
};

export default MenusPage;
