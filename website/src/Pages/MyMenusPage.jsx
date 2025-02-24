import React, { useState, useEffect } from 'react';
import { dynamoDb, MENUS_TABLE_NAME } from '../aws-config';

// Menu Component (Displays individual menus)
const MenuCard = ({ menu }) => (
  <div className="border rounded-lg p-4 mb-4 shadow bg-white">
    <div className="font-bold text-lg">Menu ID: {menu.menuID}</div>
    <div className="text-gray-600 text-sm">Saved: {new Date(menu.time).toLocaleString()}</div>
    <div className="mt-2">
      <h3 className="font-semibold">Dishes:</h3>
      <ul className="list-disc pl-4">
        {menu.dishes.map((dish, index) => (
          <li key={index} className="text-gray-700">
            {dish.name} - ${dish.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MyMenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all saved menus from DynamoDB
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      const params = { TableName: MENUS_TABLE_NAME };

      try {
        const data = await dynamoDb.scan(params).promise();
        setMenus(data.Items || []);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <h1 className="text-2xl font-bold mb-4">Saved Menus</h1>

      {loading ? (
        <p className="text-gray-500">Loading menus...</p>
      ) : menus.length === 0 ? (
        <p className="text-gray-500">No saved menus available.</p>
      ) : (
        menus.map((menu, index) => <MenuCard key={index} menu={menu} />)
      )}
    </div>
  );
};

export default MyMenusPage;
