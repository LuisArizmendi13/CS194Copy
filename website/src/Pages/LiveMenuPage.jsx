import React, { useState, useEffect } from "react";
import { dynamoDb, MENUS_TABLE_NAME } from "../aws-config";

const LiveMenuPage = () => {
  const [liveMenu, setLiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveMenu = async () => {
    try {
      const data = await dynamoDb.scan({ TableName: MENUS_TABLE_NAME }).promise();
      if (data.Items) {
        const liveMenuID = sessionStorage.getItem("liveMenuID"); // ✅ Get stored menu ID
        const selectedMenu = data.Items.find(menu => menu.menuID === liveMenuID);
        setLiveMenu(selectedMenu || null);
      }
    } catch (error) {
      console.error("❌ Error fetching live menu:", error);
      setError("Failed to load the live menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMenu(); // ✅ Fetch initially

    // ✅ Listen for live menu updates
    const handleStorageUpdate = () => fetchLiveMenu();
    window.addEventListener("liveMenuUpdated", handleStorageUpdate);

    return () => window.removeEventListener("liveMenuUpdated", handleStorageUpdate);
  }, []);

  if (loading) return <p>Loading live menu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!liveMenu) return <p>No live menu is set.</p>;

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Live Menu</h2>
      <h3 className="text-xl font-semibold">{liveMenu.name}</h3>
      <p className="text-gray-600">{liveMenu.description || "No description available."}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Dishes:</h3>
        {liveMenu.dishes && liveMenu.dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveMenu.dishes.map((dish) => (
              <div key={dish.dishId} className="border rounded p-4 shadow">
                <h4 className="text-lg font-bold">{dish.name}</h4>
                <p className="text-gray-600">${dish.price?.toFixed(2) || "0.00"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No dishes have been added to the live menu.</p>
        )}
      </div>
    </div>
  );
};

export default LiveMenuPage;
