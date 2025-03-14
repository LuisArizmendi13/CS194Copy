import React, { useState, useEffect } from "react";
import { dynamoDb, MENUS_TABLE_NAME, TABLE_NAME } from "../aws-config";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const LiveMenuPage = () => {
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch Live Menu from DynamoDB
  const fetchLiveMenu = async (restaurantId) => {
    setLoading(true);
    try {
      const params = {
        TableName: MENUS_TABLE_NAME,
        FilterExpression: "restaurantId = :rId AND isLive = :true", 
        ExpressionAttributeValues: { ":rId": restaurantId, ":true": true}
      };
      const data = await dynamoDb.scan(params).promise();

      if (data.Items.length > 0) {
        const latestMenu = data.Items.sort((a, b) => b.time - a.time)[0];
        setMenuItems(latestMenu?.dishes || []);
        setQuantities(latestMenu?.dishes.reduce((acc, dish) => {
          acc[dish.name] = 0;
          return acc;
        }, {}));
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching live menu:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Restaurant Search
  const handleRestaurantSearch = async () => {
    if (!restaurantSearch.trim()) return;
    setSelectedRestaurant(restaurantSearch.trim());
    await fetchLiveMenu(restaurantSearch.trim());
  };

  // ✅ Handle Order Submission
  const handlePlaceOrder = async () => {
    try {
      const orders = menuItems
        .filter((dish) => quantities[dish.name] > 0) // ✅ Only include ordered items
        .map((dish) => ({
          dishId: dish.dishId,
          quantity: quantities[dish.name],
          restaurantId: selectedRestaurant,
          time: new Date().toISOString()
        }));

      if (orders.length === 0) {
        alert("Please select at least one item to order.");
        return;
      }

      // ✅ Update sales for each dish in DynamoDB
      for (const order of orders) {
        const updateParams = {
          TableName: TABLE_NAME,
          Key: { dishId: order.dishId },
          UpdateExpression: "SET sales = list_append(if_not_exists(sales, :emptyList), :newSales)",
          ExpressionAttributeValues: {
            ":emptyList": [],
            ":newSales": [{ time: order.time, quantity: order.quantity }]
          }
        };
        await dynamoDb.update(updateParams).promise();
      }

      alert("✅ Order placed successfully!");
      navigate("/order");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("❌ Failed to place order. Please try again.");
    }
  };

  // ✅ Toggle Ingredients Expansion
  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ✅ Handle Quantity Change
  const handleQuantityChange = (dishName, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [dishName]: Math.max(0, prev[dishName] + amount)
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-2xl font-bold text-center mb-4">Find a Restaurant</h2>

        {/* ✅ Search Bar */}
        <div className="flex justify-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter restaurant name or ID..."
            value={restaurantSearch}
            onChange={(e) => setRestaurantSearch(e.target.value)}
            className="w-64 p-2 border rounded"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleRestaurantSearch}
          >
            Search
          </button>
        </div>

        {/* ✅ Show selected restaurant */}
        {selectedRestaurant && (
          <h3 className="text-xl font-semibold text-center mb-4">
            Live Menu for: {selectedRestaurant}
          </h3>
        )}

        {/* ✅ Show loading state */}
        {loading && <p className="text-center">Loading menu...</p>}

        {/* ✅ Show menu items if available */}
        {!loading && selectedRestaurant && (
          menuItems.length === 0 ? (
            <p className="text-center text-gray-600">No live menu available for this restaurant</p>
          ) : (
            <div>
              {menuItems.map((dish, index) => (
                <div key={index} className="border rounded p-4 mb-4 shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{dish.name}</h3>
                      <p className="text-gray-600">${dish.price?.toFixed(2)}</p>
                    </div>
                    {dish.ingredients && (
                      <button 
                        className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                        onClick={() => toggleExpand(index)}
                      >
                        {expanded[index] ? "Hide Ingredients" : "Show Ingredients"}
                      </button>
                    )}
                  </div>

                  {/* ✅ Expandable Ingredients */}
                  {expanded[index] && dish.ingredients && (
                    <ul className="mt-2">
                      {dish.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-gray-600">- {ing}</li>
                      ))}
                    </ul>
                  )}

                  {/* ✅ Quantity Selector */}
                  <div className="flex items-center mt-3">
                    <button
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                      onClick={() => handleQuantityChange(dish.name, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantities[dish.name]}
                      readOnly
                      className="mx-2 w-12 text-center border border-gray-400 rounded"
                    />
                    <button
                      className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                      onClick={() => handleQuantityChange(dish.name, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ✅ Order Button (Only visible if a restaurant is selected) */}
        {selectedRestaurant && menuItems.length > 0 && (
          <div className="text-center mt-6">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMenuPage;
