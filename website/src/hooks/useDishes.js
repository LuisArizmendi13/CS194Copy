import { useState, useEffect, useCallback } from "react";
import { fetchDishes, addDishToDatabase, deleteDish, modifyDish, fetchIngredients } from "../services/dishService";
import { getUserRestaurantId } from "../aws-config";

const useDishes = (user, session) => {
  const [dishes, setDishes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDishes = useCallback(async () => {
    if (!user || !session) return;
    setLoading(true);
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

  const loadIngredients = useCallback(async () => {
    if (!user || !session) return;
    try {
      const restaurantId = getUserRestaurantId(session);
      const ingredientList = await fetchIngredients(restaurantId);
      setIngredients(ingredientList);
    } catch (err) {
      console.error("Error loading ingredients:", err);
      // Don't set error state for ingredients to avoid blocking the UI
    }
  }, [user, session]);

  useEffect(() => {
    loadDishes();
    loadIngredients();
  }, [loadDishes, loadIngredients]);

  // ✅ Add a new dish
  const addDish = async (dish) => {
    try {
      const restaurantId = getUserRestaurantId(session);
      const newDish = await addDishToDatabase({
        ...dish,
        archive: false,
        sales: [],
        dishId: `${Date.now()}`,
      }, restaurantId);
      
      setDishes((prevDishes) => [...prevDishes, newDish]); // ✅ Update UI immediately
      
      // Refresh ingredients as there might be new ones
      loadIngredients();
      
      return true; // Return success value
    } catch (err) {
      setError(err.message);
      return false; // Return failure value
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      await deleteDish(dishId);
      setDishes((prevDishes) => prevDishes.filter((dish) => dish.dishId !== dishId)); // ✅ Update UI immediately
      return true;
    } catch (error) {
      console.error("Error deleting dish:", error);
      setError("Failed to delete dish.");
      return false;
    }
  };

  const handleModifyDish = async (updatedDish) => {
    try {
      await modifyDish(updatedDish);
      setDishes((prevDishes) =>
        prevDishes.map((dish) => (dish.dishId === updatedDish.dishId ? updatedDish : dish))
      ); // ✅ Update UI immediately
      
      // Refresh ingredients as they might have changed
      loadIngredients();
      
      return true;
    } catch (error) {
      console.error("Error modifying dish:", error);
      setError("Failed to modify dish.");
      return false;
    }
  };

  return { 
    dishes, 
    ingredients,
    loading, 
    error, 
    addDish, 
    handleDeleteDish, 
    handleModifyDish, 
    reload: loadDishes,
    reloadIngredients: loadIngredients
  };
};

export default useDishes;