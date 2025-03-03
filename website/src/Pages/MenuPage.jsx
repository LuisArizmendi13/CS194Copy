import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AWS from "aws-sdk";
import { MENUS_TABLE_NAME } from "../aws-config";
import DishSelectionPopup from "../components/Menus/DishSelectionPopup";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const MenuPage = () => {
  const { menuID } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const params = { TableName: MENUS_TABLE_NAME, Key: { menuID } };
        const data = await dynamoDb.get(params).promise();

        if (data.Item) {
          console.log("✅ Fetched Menu:", data.Item);
          setMenu(data.Item);
          setSelectedDishes(data.Item.dishes || []);
        } else {
          console.warn("⚠️ Menu not found!");
          setError("Menu not found.");
        }
      } catch (error) {
        console.error("❌ Error fetching menu:", error);
        setError("Failed to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuID]);

  const handleUpdateDishes = async (updatedDishes) => {
    if (!menu) return;
    
    const updatedMenu = { ...menu, dishes: updatedDishes };
    
    try {
      await dynamoDb.put({
        TableName: MENUS_TABLE_NAME,
        Item: updatedMenu,
      }).promise();

      console.log("✅ Menu updated successfully:", updatedMenu);
      setSelectedDishes(updatedDishes);
      setShowPopup(false);
    } catch (error) {
      console.error("❌ Error updating menu:", error);
      setError("Failed to update menu. Please try again.");
    }
  };

  if (loading) return <p className="text-center">Loading menu details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        ← Back to Menus
      </button>

      <h2 className="text-2xl font-bold mb-4">{menu.name}</h2>
      <p className="text-gray-600">{menu.description || "No description available."}</p>

      {/* Display Selected Dishes */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Dishes in This Menu:</h3>
        {selectedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedDishes.map((dish) => (
              <div key={dish.dishId} className="border rounded p-4 shadow">
                <h4 className="text-lg font-bold">{dish.name}</h4>
                <p className="text-gray-600">${dish.price?.toFixed(2) || "0.00"}</p>
                <ul className="mt-2">
                  {dish.ingredients?.map((ing, idx) => (
                    <li key={idx} className="text-sm text-gray-600">- {ing}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No dishes have been added to this menu yet.</p>
        )}
      </div>

      {/* Update Dishes Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Dishes
      </button>

      {/* Dish Selection Popup */}
      {showPopup && (
        <DishSelectionPopup
          onClose={() => setShowPopup(false)}
          onSelectDishes={handleUpdateDishes}
          selectedDishes={selectedDishes}
        />
      )}
    </div>
  );
};

export default MenuPage;
