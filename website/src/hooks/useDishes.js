import { useState, useEffect, useCallback } from "react";
import { fetchDishes, addDishToDatabase, deleteDish, modifyDish } from "../services/dishService";
import { getUserRestaurantId } from "../aws-config";

const useDishes = (user, session) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDishes = useCallback(async () => {
    if (!user || !session) return;
    try {
      const restaurantId = getUserRestaurantId(session);
      const items = await fetchDishes(restaurantId);
      setDishes(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);


  const addDish = async (dish) => {
    try {
      const restaurantId = getUserRestaurantId(session);
      const newDish = await addDishToDatabase(dish, restaurantId);
      setDishes((prevDishes) => [...prevDishes, newDish]); // ✅ Update UI immediately
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await deleteDish(dishId);
      setDishes((prevDishes) => prevDishes.filter((dish) => dish.dishId !== dishId)); // ✅ Update UI immediately
    } catch (error) {
      console.error("Error deleting dish:", error);
      setError("Failed to delete dish.");
    }
  };

  const handleModifyDish = async (updatedDish) => {
    try {
      await modifyDish(updatedDish);
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      ); // ✅ Update UI immediately
    } catch (error) {
      console.error("Error modifying dish:", error);
      setError("Failed to modify dish.");
    }
  };

  return { dishes, loading, error, addDish, handleDeleteDish, handleModifyDish, reload: loadDishes };
};

export default useDishes;
