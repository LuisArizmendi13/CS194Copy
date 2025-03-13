import React from "react";
import { useNavigate } from "react-router-dom";
import { setLiveMenu } from "../../services/menuService";

const MyMenusSection = ({ menus, fetchMenus }) => {
  const navigate = useNavigate();

  const handleEditMenu = (menuID) => {
    navigate(`/menus/${menuID}`);
  };

  const handleSetLiveMenu = async (menu) => {
    try {
      await setLiveMenu(menu, menu.restaurantId);
      fetchMenus(menu.restaurantId); // Refresh menu list
    } catch (error) {
      console.error("Error setting menu as live:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-900">My Menus</h1>
        <button
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/create-menu")}
        >
          + New Menu
        </button>
      </div>

      {menus.length === 0 ? (
        <div className="bg-white p-4 rounded-md shadow-sm text-center">
          <p className="text-gray-600 mb-4">You haven't created any menus yet.</p>
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
                <h3 className="text-base font-semibold text-gray-800">{menu.name}</h3>
                {menu.isLive && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">LIVE</span>
                )}
                <p className="text-gray-600 text-sm mb-2">{menu.description || "No description available."}</p>
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
                      onClick={() => handleSetLiveMenu(menu)}
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
  );
};

export default MyMenusSection;
