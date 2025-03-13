import { useState, useEffect, useCallback } from "react";
import { fetchDishes,addDishToDatabase  } from "../services/dishService";
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

  return { dishes, loading, error, reload: loadDishes };
};

export default useDishes;
