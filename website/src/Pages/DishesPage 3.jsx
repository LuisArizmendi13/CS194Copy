import React, { useState, useEffect } from 'react';
import { dynamoDb, TABLE_NAME } from '../aws-config';
import AddDishPopup from '../components/AddDishPopup';
import DishList from '../components/DishList';

const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const data = await dynamoDb.scan({ TableName: TABLE_NAME }).promise();
        if (data.Items) setDishes(data.Items);
      } catch (error) {
        console.error("Error fetching dishes from DynamoDB:", error);
      }
    };
    fetchDishes();
  }, []);

  const addDish = (dish) => setDishes([...dishes, dish]);

  const updateSaleCount = (dishId, updatedSales) => {
    setDishes(prevDishes =>
      prevDishes.map(d =>
        d.dishId === dishId ? { ...d, sales: updatedSales } : d
      )
    );
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      {/* Wrapper for Button (top-right) */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowPopup(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Dish
        </button>
      </div>

      {/* All Dishes Appear Below */}
      <DishList dishes={dishes} onArchiveChange={(id, status) => {
        setDishes(prevDishes => prevDishes.map(d => d.dishId === id ? { ...d, archive: status } : d));
      }} onSaleRecorded={updateSaleCount} />

      {showPopup && <AddDishPopup onClose={() => setShowPopup(false)} onSave={addDish} />}
    </div>
  );
};

export default DishesPage;
