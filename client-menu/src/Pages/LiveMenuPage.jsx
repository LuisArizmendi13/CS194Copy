import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dynamoDb, MENUS_TABLE_NAME, TABLE_NAME } from "../aws-config";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import MenuList from "../components/MenuList";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import Footer from "../components/Footer";

const LiveMenuPage = () => {
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

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
        setQuantities(latestMenu?.dishes.reduce((acc, dish) => {
          acc[dish.name] = 0;
          return acc;
        }, {}));
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

  const handleRestaurantSearch = async () => {
    if (!restaurantSearch.trim()) return;
    setSelectedRestaurant(restaurantSearch.trim());
    await fetchLiveMenu(restaurantSearch.trim());
  };

  const handlePlaceOrder = async () => {
    try {
      const orders = menuItems.filter(dish => quantities[dish.name] > 0).map(dish => ({
        dishId: dish.dishId,
        quantity: quantities[dish.name],
        restaurantId: selectedRestaurant,
        time: new Date().toISOString(),
      }));
      if (orders.length === 0) {
        alert("Please select at least one item to order.");
        return;
      }
      for (const order of orders) {
        const updateParams = {
          TableName: TABLE_NAME,
          Key: { dishId: order.dishId },
          UpdateExpression: "SET sales = list_append(if_not_exists(sales, :emptyList), :newSales)",
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

  if (error) return <ErrorMessage error={error} />;
  if (loading) return <LoadingIndicator />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Menu Venue" />
      <div className="max-w-6xl mx-auto p-4">
        <SearchBar
          restaurantSearch={restaurantSearch}
          setRestaurantSearch={setRestaurantSearch}
          handleRestaurantSearch={handleRestaurantSearch}
        />
        {selectedRestaurant && <h2 className="text-lg font-semibold">Menu for: {selectedRestaurant}</h2>}
        <MenuList menuItems={menuItems} quantities={quantities} setQuantities={setQuantities} />
        {menuItems.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default LiveMenuPage;
