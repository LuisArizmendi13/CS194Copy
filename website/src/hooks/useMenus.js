// src/hooks/useMenus.js
import { useState, useEffect, useCallback } from "react";
import { fetchMenus } from "../services/menuService";
import { getUserRestaurantId } from "../aws-config";

const useMenus = (session) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMenus = useCallback(async () => {
    if (!session) return;
    try {
      const restaurantId = getUserRestaurantId(session);
      const items = await fetchMenus(restaurantId);
      setMenus(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  return { menus, loading, error, reload: loadMenus };
};

export default useMenus;
