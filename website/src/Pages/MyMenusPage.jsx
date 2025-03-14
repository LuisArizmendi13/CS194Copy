import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useMenus from "../hooks/useMenus";
import MenuList from "../components/Menus/MenuList";
import NewMenuButton from "../components/Menus/NewMenuButton";
import UploadMenuPopup from "../components/UploadMenuPopup";

const MyMenusPage = () => {
  const { session } = useAuth();
  const { menus, loading, error, reload } = useMenus(session);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // Deletion handler: you can either reload or update state locally.
  const handleDeleteMenu = (deletedMenuID) => {
    reload();
  };

  // Listen for live menu updates and refresh menus immediately.
  useEffect(() => {
    const handleLiveMenuUpdated = () => {
      reload();
    };
    window.addEventListener("liveMenuUpdated", handleLiveMenuUpdated);
    return () => window.removeEventListener("liveMenuUpdated", handleLiveMenuUpdated);
  }, [reload]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-end space-x-4 border-b pb-4">
        <NewMenuButton />
        <div className="h-6 border-l border-gray-400"></div>{" "}
        {/* ✅ Vertical Divider */}
        <button
          onClick={() => setShowUploadPopup(true)}
          className="px-4 py-2 bg-[#FA8072] text-white rounded hover:bg-[#E96B5F]"
        >
          Generate
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading menus...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <MenuList menus={menus} onDelete={handleDeleteMenu} />
      )}

      {/* ✅ Upload Popup (Shows when `showUploadPopup` is true) */}
      {showUploadPopup && (
        <UploadMenuPopup onClose={() => setShowUploadPopup(false)} />
      )}
    </div>
  );
};

export default MyMenusPage;
