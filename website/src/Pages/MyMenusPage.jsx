import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dynamoDb, MENUS_TABLE_NAME, getUserRestaurantId } from "../aws-config";
import NewMenuButton from "../components/Menus/NewMenuButton";
import MenuList from "../components/Menus/MenuList";

const MyMenusPage = () => {
  const { session } = useAuth();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Ensures menus load correctly

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
          ExpressionAttributeValues: { ":rId": restaurantId }
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
      {/* ✅ Keep button at the top */}
      <div className="mb-6 flex justify-end">
        <NewMenuButton />
      </div>

      {/* ✅ Show loading message to prevent misalignment */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading menus...</p>
      ) : (
        <MenuList menus={menus} /> // ✅ Pass menus directly to keep existing formatting
      )}
    </div>
  );
};

export default MyMenusPage;
