import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import useMenus from "../hooks/useMenus";
import useDishes from "../hooks/useDishes";
import AddDishPopup from "../components/AddDishPopup";
import UploadMenuPopup from "../components/UploadMenuPopup";
import { getCategories, getFilteredDishes } from "../utils/menuHelpers";

// Import your new tab components
import LiveMenu from "../subPages/LiveMenu";
import MyMenus from "../subPages/MyMenus";
import DishLibrary from "../subPages/DishLibrary";

const MenusPage = () => {
  const { user, session } = useAuth();
  const {
    menus,
    liveMenu,
    loading: menusLoading,
    deleteMenu,
    setMenuAsLive,
    addDishToMenu,
  } = useMenus(session);

  const {
    dishes,
    handleModifyDish,
    handleDeleteDish,
    loading: dishesLoading,
    addDish,
    reload: reloadDishes,
  } = useDishes(user, session);

  // Local UI state
  const [activeTab, setActiveTab] = useState("live");
  const [showDishPopup, setShowDishPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showHelpText, setShowHelpText] = useState(true);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // React Router
  const navigate = useNavigate();
  const location = useLocation();

  // Derived data
  const categories = getCategories(liveMenu);
  const filteredDishes = getFilteredDishes(liveMenu, selectedCategory);

  // Handle URL query param ?tab=...
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab");
    if (tabParam && ["live", "menus", "dishes"].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [location.search, activeTab]);

  // Loading states
  if (menusLoading || dishesLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  // If not signed in
  if (!user) {
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-700">
        Redirecting to Sign In...
      </div>
    );
  }

  // Shared helper components
  const CloseButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

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

        {/* Conditionally render each tab's component */}
        {activeTab === "live" && (
          <LiveMenu
            liveMenu={liveMenu}
            categories={categories}
            filteredDishes={filteredDishes}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            showHelpText={showHelpText}
            setShowHelpText={setShowHelpText}
            navigate={navigate}
            InfoBox={InfoBox}
          />
        )}

        {activeTab === "menus" && (
          <MyMenus
            menus={menus}
            dishes={dishes}
            deleteMenu={deleteMenu}
            setMenuAsLive={setMenuAsLive}
            showHelpText={showHelpText}
            setShowHelpText={setShowHelpText}
            showUploadPopup={showUploadPopup}
            setShowUploadPopup={setShowUploadPopup}
            navigate={navigate}
            InfoBox={InfoBox}
          />
        )}

        {activeTab === "dishes" && (
          <DishLibrary
            dishes={dishes}
            handleDeleteDish={handleDeleteDish}
            addDish={addDish}
            showDishPopup={showDishPopup}
            setShowDishPopup={setShowDishPopup}
            showHelpText={showHelpText}
            setShowHelpText={setShowHelpText}
            InfoBox={InfoBox}
          />
        )}
      </div>

      {/* Dish Popup */}
      {showDishPopup && <AddDishPopup onClose={() => setShowDishPopup(false)} onSave={addDish} />}

      {/* Upload Popup */}
      {showUploadPopup && <UploadMenuPopup onClose={() => setShowUploadPopup(false)} />}
    </div>
  );
};

export default MenusPage;
