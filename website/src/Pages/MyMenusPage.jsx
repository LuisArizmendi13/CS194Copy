import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useMenus from "../hooks/useMenus";
import useDishes from "../hooks/useDishes";
import InfoBox from "../components/InfoBox";
import MenuNav from "../components/Menus/MenuNav";
import MenuCard from "../components/Menus/MenuCard";
import UploadMenuPopup from "../components/UploadMenuPopup";

/**
 * Page component for viewing and managing the user's menu collection
 */
const MyMenusPage = () => {
  const { user, session } = useAuth();
  const { menus, loading: menusLoading, deleteMenu, setMenuAsLive } = useMenus(session);
  const { dishes, loading: dishesLoading } = useDishes(user, session);
  const [showHelpText, setShowHelpText] = useState(true);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const navigate = useNavigate();

  if (menusLoading || dishesLoading) {
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

  const handleDeleteMenu = (menuID) => {
    if (window.confirm("Are you sure you want to delete this menu? This action cannot be undone.")) {
      deleteMenu(menuID);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <MenuNav />

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
            <button 
              className="px-3 py-1.5 text-sm bg-rose-500 text-white rounded hover:bg-rose-600 transition" 
              onClick={() => setShowUploadPopup(true)}
            >
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
                  onClick={() => navigate("/menus/dish-library")}
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
              <MenuCard
                key={menu.menuID}
                menu={menu}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
                onSetLive={setMenuAsLive}
              />
            ))}
          </div>
        )}

        {/* Upload Popup - Shows only when showUploadPopup is true */}
        {showUploadPopup && (
          <UploadMenuPopup onClose={() => setShowUploadPopup(false)} />
        )}
      </div>
    </div>
  );
};

export default MyMenusPage;