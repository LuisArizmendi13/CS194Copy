import React, { useState, useEffect } from "react";
import { dynamoDb, TABLE_NAME,/* MENUS_TABLE_NAME*/ } from "../aws-config";  // ✅ Ensure TABLE_NAME is included

const LiveMenuPage = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
        if (data.Items) {
          setDishes(data.Items.filter(dish => !dish.archive));  // ✅ Only show active dishes
        }
      } catch (error) {
        console.error("Error fetching dishes from DynamoDB:", error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <h2 className="text-2xl font-bold mb-4">Live Menu</h2>
      {dishes.map((dish, index) => (
        <div key={index} className="border rounded p-4 mb-4 shadow">
          <h3 className="text-lg font-bold">{dish.name}</h3>
          <p className="text-gray-600">${dish.price?.toFixed(2) ?? "0.00"}</p>
          <ul className="mt-2">
            {dish.ingredients.map((ing, idx) => (
              <li key={idx} className="text-sm text-gray-600">- {ing}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LiveMenuPage;
