import React, { useState } from "react";
import { dynamoDb, MENUS_TABLE_NAME, getUserRestaurantId } from "../../aws-config";
import { useAuth } from "../../context/AuthContext";

const GeneratedMenu = ({ extractedMenu, onClose }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSaveMenu = async () => {
    setLoading(true);
    setError("");

    try {
      const parsedMenu = JSON.parse(extractedMenu); // Convert AI response to JSON
      console.log("✅ Parsed AI Menu:", parsedMenu);

      const restaurantId = getUserRestaurantId(session);
      if (!restaurantId) {
        console.error("❌ No restaurant ID found!");
        return;
      }

      // ✅ Save extracted menu to DynamoDB
      const newMenu = {
        menuID: `menu-${Date.now()}`,
        restaurantId,
        name: "AI Generated Menu",
        dishes: parsedMenu, // Use AI extracted dishes
        time: Date.now(),
      };

      await dynamoDb.put({ TableName: MENUS_TABLE_NAME, Item: newMenu }).promise();
      console.log("✅ AI Menu saved:", newMenu);

      alert("Menu saved successfully!");
      onClose(); // Close popup after saving
    } catch (error) {
      console.error("❌ Error saving AI-generated menu:", error);
      setError("Failed to save the menu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Generated Menu</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="overflow-y-auto max-h-60 border p-2 rounded bg-gray-100">
          <pre className="text-xs">{extractedMenu}</pre>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={handleSaveMenu} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            {loading ? "Saving..." : "Save Menu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedMenu;
