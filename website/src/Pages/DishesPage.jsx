import React, { useState, useEffect } from 'react';
import { dynamoDb, TABLE_NAME, getUserRestaurantId } from '../aws-config';
import { useAuth } from '../context/AuthContext';
import AddDishPopup from '../components/AddDishPopup';
import DishList from '../components/DishList';

const DishesPage = () => {
  const { user, session } = useAuth(); // ✅ Get session from AuthContext
  const [dishes, setDishes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user || !session) return; // Ensure user is authenticated

    const fetchDishes = async () => {
      try {
        const restaurantId = getUserRestaurantId(session); // ✅ Use session now stored in AuthContext
        if (!restaurantId) {
          console.warn("❌ No restaurantId found in session!");
          return;
        }

        //console.log(`✅ Fetching dishes for restaurant: ${restaurantId}`);

        const params = {
          TableName: TABLE_NAME,
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId }
        };

        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          //console.log("✅ Fetched Dishes:", data.Items);
          setDishes(data.Items);
        } else {
          console.log("⚠️ No dishes found for this restaurant.");
        }
      } catch (error) {
        console.error("❌ Error fetching dishes from DynamoDB:", error);
      }
    };

    fetchDishes();
  }, [user, session]);

  const addDish = async (dish) => {
    try {
      const restaurantId = getUserRestaurantId(session);
      if (!restaurantId) {
        console.error("❌ Cannot save dish: No restaurantId found!");
        return;
      }

      const dishWithRestaurant = { ...dish, restaurantId };
      await dynamoDb.put({ TableName: TABLE_NAME, Item: dishWithRestaurant }).promise();
      setDishes([...dishes, dishWithRestaurant]);
    } catch (error) {
      console.error("Error saving dish:", error);
    }
  };

  const updateSaleCount = (dishId, updatedSales) => {
    setDishes(prevDishes =>
      prevDishes.map(d => (d.dishId === dishId ? { ...d, sales: updatedSales } : d))
    );
  };

  const handleDelete = async (dishId) => {
    try {
      // Delete the dish from DynamoDB
      await dynamoDb.delete({
        TableName: TABLE_NAME,
        Key: { dishId: dishId },
      }).promise();

      // Update the local state by filtering out the deleted dish
      setDishes(prevDishes => prevDishes.filter(d => d.dishId !== dishId));
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowPopup(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          + New Dish
        </button>
      </div>

      <DishList
        dishes={dishes}
        onArchiveChange={(id, status) =>
          setDishes(prevDishes =>
            prevDishes.map(d => (d.dishId === id ? { ...d, archive: status } : d))
          )
        }
        onSaleRecorded={updateSaleCount}
        onDelete={handleDelete} // Pass handleDelete to DishList
      />

      {showPopup && <AddDishPopup onClose={() => setShowPopup(false)} onSave={addDish} />}
    </div>
  );
};

export default DishesPage;
