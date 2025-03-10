import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dynamoDb, MENUS_TABLE_NAME, getUserRestaurantId } from "../aws-config";
import NewMenuButton from "../components/Menus/NewMenuButton";
import UploadMenuPopup from "../components/UploadMenuPopup";
import MenuList from "../components/Menus/MenuList";

const MyMenusPage = () => {
  const { session } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchMenus = async () => {
      try {
        const restaurantId = getUserRestaurantId(session);
        if (!restaurantId) {
          console.warn("❌ No restaurantId found!");
          setLoading(false);
          return;
        }

        const params = {
          TableName: MENUS_TABLE_NAME,
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId },
        };

        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          console.log("✅ Fetched Menus:", data.Items);
          setMenus(data.Items);
        }
      } catch (error) {
        console.error("❌ Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [session]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ✅ Buttons Section - Side by Side with a Divider */}
      <div className="mb-6 flex items-center justify-end space-x-4 border-b pb-4">
        <NewMenuButton />
        <div className="h-6 border-l border-gray-400"></div> {/* ✅ Vertical Divider */}
        <button
          onClick={() => setShowUploadPopup(true)}
          className="px-4 py-2 bg-[#FA8072] text-white rounded hover:bg-[#E96B5F]"

        >
          Generate
        </button>
      </div>

      {/* ✅ Show loading message */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading menus...</p>
      ) : (
        <MenuList menus={menus} />
      )}

      {/* ✅ Upload Popup (Shows when `showUploadPopup` is true) */}
      {showUploadPopup && <UploadMenuPopup onClose={() => setShowUploadPopup(false)} />}
    </div>
  );
};

export default MyMenusPage;
