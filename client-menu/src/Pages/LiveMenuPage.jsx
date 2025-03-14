import React, { useState, useEffect } from "react";
import { dynamoDb, MENUS_TABLE_NAME, TABLE_NAME } from "../aws-config";
import { useNavigate } from "react-router-dom";

const LiveMenuPage = () => {
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch Live Menu from DynamoDB
  const fetchLiveMenu = async (restaurantId) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        TableName: MENUS_TABLE_NAME,
        FilterExpression: "restaurantId = :rId AND isLive = :true",
        ExpressionAttributeValues: { ":rId": restaurantId, ":true": true },
      };
      const data = await dynamoDb.scan(params).promise();

      if (data.Items.length > 0) {
        const latestMenu = data.Items.sort((a, b) => b.time - a.time)[0];
        setMenuItems(latestMenu?.dishes || []);
        setQuantities(
          latestMenu?.dishes.reduce((acc, dish) => {
            acc[dish.name] = 0;
            return acc;
          }, {})
        );
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error fetching live menu:", error);
      setError("Unable to find the restaurant menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Restaurant Search
  const handleRestaurantSearch = async () => {
    if (!restaurantSearch.trim()) return;
    setSelectedRestaurant(restaurantSearch.trim());
    await fetchLiveMenu(restaurantSearch.trim());
  };

  // Handle Order Submission
  const handlePlaceOrder = async () => {
    try {
      const orders = menuItems
        .filter((dish) => quantities[dish.name] > 0)
        .map((dish) => ({
          dishId: dish.dishId,
          quantity: quantities[dish.name],
          restaurantId: selectedRestaurant,
          time: new Date().toISOString(),
        }));

      if (orders.length === 0) {
        alert("Please select at least one item to order.");
        return;
      }

      // Update sales for each dish in DynamoDB
      for (const order of orders) {
        const updateParams = {
          TableName: TABLE_NAME,
          Key: { dishId: order.dishId },
          UpdateExpression:
            "SET sales = list_append(if_not_exists(sales, :emptyList), :newSales)",
          ExpressionAttributeValues: {
            ":emptyList": [],
            ":newSales": [{ time: order.time, quantity: order.quantity }],
          },
        };
        await dynamoDb.update(updateParams).promise();
      }

      alert("Order placed successfully!");
      navigate("/order");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  // Toggle Ingredients Expansion
  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Handle Quantity Change
  const handleQuantityChange = (dishName, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [dishName]: Math.max(0, prev[dishName] + amount),
    }));
  };

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Menu Venue</h1>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Menu Venue</h1>
          </div>
        </header>

        <div className="max-w-6xl mx-auto py-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Menu Venue</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Find a Restaurant
              </h1>
              <p className="text-sm text-gray-600">
                Search for a restaurant to view their menu and place an order
              </p>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white rounded-md shadow-sm p-4 mb-6">
          <div className="md:flex md:items-center">
            <div className="flex-grow mb-3 md:mb-0 md:mr-4">
              <input
                type="text"
                placeholder="Enter restaurant name or ID..."
                value={restaurantSearch}
                onChange={(e) => setRestaurantSearch(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
              onClick={handleRestaurantSearch}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Show selected restaurant */}
        {selectedRestaurant && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Menu for: {selectedRestaurant}
            </h2>
          </div>
        )}

        {/* Menu items section */}
        {selectedRestaurant && menuItems.length === 0 ? (
          <div className="bg-white rounded-md shadow-sm p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No menu found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This restaurant doesn't have an active menu at the moment.
            </p>
          </div>
        ) : (
          selectedRestaurant && (
            <div>
              <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
                <div className="border-b border-gray-100 p-4">
                  <h3 className="text-base font-bold text-gray-800">
                    Available Menu Items
                  </h3>
                </div>
                <div className="p-4">
                  <div className="divide-y divide-gray-200">
                    {menuItems.map((dish, index) => (
                      <div key={index} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">
                              {dish.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ${dish.price?.toFixed(2)}
                            </p>

                            {/* Ingredients section */}
                            {expanded[index] && dish.ingredients && (
                              <div className="mt-2 ml-2">
                                <p className="text-xs text-gray-500 mb-1">
                                  Ingredients:
                                </p>
                                <ul className="list-disc list-inside text-xs text-gray-600 pl-2 space-y-0.5">
                                  {dish.ingredients.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {dish.ingredients && (
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => toggleExpand(index)}
                              >
                                {expanded[index]
                                  ? "Hide details"
                                  : "Show details"}
                              </button>
                            )}

                            <div className="flex items-center space-x-2">
                              <button
                                className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                onClick={() =>
                                  handleQuantityChange(dish.name, -1)
                                }
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm">
                                {quantities[dish.name]}
                              </span>
                              <button
                                className="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                                onClick={() =>
                                  handleQuantityChange(dish.name, 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Button */}
              {menuItems.length > 0 && (
                <div className="flex justify-end mb-6">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                    onClick={handlePlaceOrder}
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Place Order
                  </button>
                </div>
              )}
            </div>
          )
        )}

        <footer className="text-center text-gray-500 text-xs mt-6 mb-2">
          <p>Menu Venue Customer Portal • {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default LiveMenuPage;
