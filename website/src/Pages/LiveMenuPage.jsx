import React, { useState, useEffect, useCallback } from "react";
import { dynamoDb, MENUS_TABLE_NAME, getUserRestaurantId } from "../aws-config";
import { useAuth } from "../context/AuthContext";

const LiveMenuPage = () => {
  const { session } = useAuth();
  const [liveMenu, setLiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveMenu = useCallback(async () => {
    try {
      let params;
      if (session) {
        const restaurantId = getUserRestaurantId(session);
        params = {
          TableName: MENUS_TABLE_NAME,
          FilterExpression: "restaurantId = :rId AND isLive = :live",
          ExpressionAttributeValues: {
            ":rId": restaurantId,
            ":live": true,
          },
        };
      } else {
        params = {
          TableName: MENUS_TABLE_NAME,
          FilterExpression: "isLive = :live",
          ExpressionAttributeValues: {
            ":live": true,
          },
        };
      }
      const data = await dynamoDb.scan(params).promise();
      if (data.Items && data.Items.length > 0) {
        setLiveMenu(data.Items[0]);
      } else {
        setLiveMenu(null);
      }
    } catch (error) {
      console.error("❌ Error fetching live menu:", error);
      setError("Failed to load the live menu.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchLiveMenu();

    const handleLiveMenuUpdated = () => {
      fetchLiveMenu();
    };
    window.addEventListener("liveMenuUpdated", handleLiveMenuUpdated);
    return () =>
      window.removeEventListener("liveMenuUpdated", handleLiveMenuUpdated);
  }, [fetchLiveMenu]);

  if (loading) return <p>Loading live menu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!liveMenu) return <p>No live menu is set.</p>;

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Live Menu</h2>
      <h3 className="text-xl font-semibold">{liveMenu.name}</h3>
      <p className="text-gray-600">
        {liveMenu.description || "No description available."}
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Dishes:</h3>
        {liveMenu.dishes && liveMenu.dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveMenu.dishes.map((dish) => (
              <div key={dish.dishId} className="border rounded p-4 shadow">
                <h4 className="text-lg font-bold">{dish.name}</h4>
                <p className="text-gray-600">
                  ${dish.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No dishes have been added to the live menu.
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveMenuPage;
