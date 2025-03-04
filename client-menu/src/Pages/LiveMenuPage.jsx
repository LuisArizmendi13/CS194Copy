import React, { useState, useEffect } from "react";
import { dynamoDb, MENUS_TABLE_NAME } from "../aws-config";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const LiveMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [quantities, setQuantities] = useState({}); // ✅ Track quantity for each dish
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveMenu = async () => {
      try {
        const params = { TableName: MENUS_TABLE_NAME };
        const data = await dynamoDb.scan(params).promise();

        if (data.Items) {
          const latestMenu = data.Items.sort((a, b) => b.time - a.time)[0];
          setMenuItems(latestMenu?.dishes || []);
          setQuantities(latestMenu?.dishes.reduce((acc, dish) => {
            acc[dish.name] = 0; // Initialize quantity at 0
            return acc;
          }, {}));
        }
      } catch (error) {
        console.error("Error fetching live menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMenu();
  }, []);

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleQuantityChange = (dishName, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [dishName]: Math.max(0, prev[dishName] + amount), // Ensure quantity is never negative
    }));
  };

  if (loading) return <p className="text-center p-4">Loading menu...</p>;

  return (
    <div>
      <Navbar /> {/* ✅ Added Navbar */}
      <div className="p-6 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="text-2xl font-bold text-center mb-4">Live Menu</h2>

        {menuItems.length === 0 ? (
          <p className="text-center text-gray-600">No menu available</p>
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

                {/* Expandable Ingredients */}
                {expanded[index] && dish.ingredients && (
                  <ul className="mt-2">
                    {dish.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-600">- {ing}</li>
                    ))}
                  </ul>
                )}

                {/* Quantity Selector */}
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
        )}

        <div className="text-center mt-6">
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate("/order")}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveMenuPage;
