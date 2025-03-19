import React from "react";
import UploadMenuPopup from "../components/UploadMenuPopup";

const MyMenus = ({
  menus,
  dishes,
  deleteMenu,
  setMenuAsLive,
  showHelpText,
  setShowHelpText,
  showUploadPopup,
  setShowUploadPopup,
  navigate,
  InfoBox,
}) => {
  // Handler
  const handleDeleteMenu = (menuID) => {
    if (window.confirm("Are you sure you want to delete this menu? This action cannot be undone.")) {
      deleteMenu(menuID);
    }
  };

  return (
    <div>
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

          {/* Upload Popup - Shows only when showUploadPopup is true */}
          {showUploadPopup && (
            <UploadMenuPopup onClose={() => setShowUploadPopup(false)} />
          )}
        </div>
      </div>

      {/** If no dishes, show notice */}
      {dishes.length === 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 mb-4 text-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
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
                onClick={() => navigate("?tab=dishes")} // Or setActiveTab("dishes")
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
            <div key={menu.menuID} className="bg-white rounded-md shadow-sm overflow-hidden">
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
                  Created: {new Date(menu.createdAt || Date.now()).toLocaleDateString()}
                </p>

                <div className="flex justify-between">
                  <button
                    className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
                    onClick={() => {
                      console.log("Navigating to edit menu with ID:", menu.menuID);
                      navigate(`/menus/${menu.menuID}`);
                    }}
                  >
                    Edit
                  </button>
                  <div className="flex items-center space-x-2">
                    {!menu.isLive && (
                      <button
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => setMenuAsLive(menu.menuID)}
                      >
                        Set Live
                      </button>
                    )}
                    <button
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDeleteMenu(menu.menuID)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMenus;
