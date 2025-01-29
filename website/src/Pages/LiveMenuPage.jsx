import React, { useState, useEffect } from 'react';
import { dynamoDb, MENUS_TABLE_NAME, TABLE_NAME } from '../aws-config';

// Live Menu Dish Component (No Active Checkbox or Sale Button)
const LiveMenuDish = ({ dish }) => (
  <div className="border rounded p-4 flex justify-between items-center mb-4 shadow">
    <div>
      <div className="text-lg font-bold">{dish.name}</div>
      <div className="text-gray-600">${dish.price.toFixed(2)}</div>
      <ul className="mt-2">
        {dish.ingredients.map((ing, index) => (
          <li key={index} className="text-sm text-gray-600">- {ing}</li>
        ))}
      </ul>
    </div>
  </div>
);

const LiveMenuPage = () => {
  const [activeDishes, setActiveDishes] = useState([]);

  // Fetch only active dishes from the Dishes table
  useEffect(() => {
    const fetchActiveDishes = async () => {
      const params = { TableName: TABLE_NAME };
      try {
        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          // Filter only active dishes
          setActiveDishes(data.Items.filter(dish => !dish.archive));
        }
      } catch (error) {
        console.error("Error fetching dishes from DynamoDB:", error);
      }
    };
    fetchActiveDishes();
  }, []);

  // Save current active menu to the Menus table
  const saveMenu = async () => {
    if (activeDishes.length === 0) {
      alert("No active dishes to save in the menu.");
      return;
    }

    // Create a menu object with a unique menuID
    const menu = {
      menuID: `menu-${Date.now()}`, // Generate unique menuID
      time: new Date().toISOString(),
      dishes: activeDishes.map(dish => ({
        dishId: dish.dishId, // Ensuring dishId exists
        name: dish.name,
        price: dish.price,
        ingredients: dish.ingredients,
      })),
    };

    const params = {
      TableName: MENUS_TABLE_NAME,
      Item: menu,
    };

    try {
      await dynamoDb.put(params).promise();
      alert("Menu saved successfully!");
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <button
        onClick={saveMenu}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 float-right block"
      >
        + Menu
      </button>
      <div style={{ clear: 'both' }}></div>
      {activeDishes.map((dish, index) => (
        <LiveMenuDish key={index} dish={dish} />
      ))}
    </div>
  );
};

export default LiveMenuPage;
