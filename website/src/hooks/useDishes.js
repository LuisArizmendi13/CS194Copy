import { useState, useEffect, useCallback } from "react";
import { fetchDishes } from "../services/dishService";
import { getUserRestaurantId } from "../aws-config";

const useDishes = (user, session) => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDishes = useCallback(async () => {
    // Ensure both user and session exist before fetching.
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

  return { dishes, loading, error, reload: loadDishes };
};

export default useDishes;
