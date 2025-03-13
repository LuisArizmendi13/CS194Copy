import { useState, useEffect } from "react";
import { fetchMenus, setLiveMenu, updateMenuInDatabase, deleteMenuFromDatabase } from "../services/menuService"; // ✅ Using existing service function
import { getUserRestaurantId } from "../aws-config";

const useMenus = (session) => {
  const [menus, setMenus] = useState([]);
  const [liveMenu, setLiveMenuState] = useState(null); // ✅ Renamed to avoid conflict with function name
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const getMenus = async () => {
      try {
        const restaurantId = getUserRestaurantId(session);
        if (!restaurantId) {
          setLoading(false);
          return;
        }

        const menusData = await fetchMenus(restaurantId);
        setMenus(menusData);

        const liveMenuID = sessionStorage.getItem("liveMenuID");
        const currentLiveMenu =
          menusData.find((menu) => menu.menuID === liveMenuID) ||
          menusData.find((menu) => menu.isLive);
        setLiveMenuState(currentLiveMenu);
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    getMenus();
  }, [session]);

  // ✅ New function to set a menu as live
  const setMenuAsLive = async (menuId) => {
    try {
      const restaurantId = getUserRestaurantId(session);
      const selectedMenu = menus.find((menu) => menu.menuID === menuId);

      if (selectedMenu) {
        await setLiveMenu(selectedMenu, restaurantId); // ✅ Calls the existing service function

        // ✅ Update UI immediately
        setMenus((prevMenus) =>
          prevMenus.map((menu) =>
            menu.menuID === menuId ? { ...menu, isLive: true } : { ...menu, isLive: false }
          )
        );
        setLiveMenuState(selectedMenu);
      }
    } catch (err) {
      console.error("Error setting menu as live:", err);
    }
  }; 

  const updateMenu = async (updatedMenu) => {
    try {
      const savedMenu = await updateMenuInDatabase(updatedMenu);

      // ✅ Update UI immediately
      setMenus((prevMenus) =>
        prevMenus.map((menu) =>
          menu.menuID === savedMenu.menuID ? savedMenu : menu
        )
      );

      // ✅ If the live menu was edited, update state
      if (liveMenu?.menuID === savedMenu.menuID) {
        setLiveMenuState(savedMenu);
      }
    } catch (err) {
      console.error("Error updating menu:", err);
    }
  };

  // ✅ New function to delete a menu
  const deleteMenu = async (menuID) => {
    try {
      await deleteMenuFromDatabase(menuID); // ✅ Calls the service function

      // ✅ Update UI immediately
      setMenus((prevMenus) => prevMenus.filter((menu) => menu.menuID !== menuID));

      // ✅ If the deleted menu was the live menu, clear it
      if (liveMenu?.menuID === menuID) {
        setLiveMenuState(null);
      }
    } catch (err) {
      console.error("Error deleting menu:", err);
    }
  };

  const addDishToMenu = async (dish) => {
    if (!liveMenu) return;
  
    const isDishInMenu = liveMenu.dishes?.some((d) => d.dishId === dish.dishId);
    if (isDishInMenu) {
      alert(`${dish.name} is already in the menu`);
      return;
    }
  
    const updatedMenu = {
      ...liveMenu,
      dishes: [...(liveMenu.dishes || []), dish],
    };
  
    try {
      await updateMenuInDatabase(updatedMenu); // ✅ Calls menuService.js
      setLiveMenuState(updatedMenu);
      setMenus((prevMenus) =>
        prevMenus.map((m) => (m.menuID === updatedMenu.menuID ? updatedMenu : m))
      );
      alert(`${dish.name} added to ${liveMenu.name}`);
    } catch (err) {
      console.error("Error adding dish to menu:", err);
      alert("Error adding dish to menu");
    }
  };
  

  return { menus, liveMenu, loading, setMenuAsLive };
};

export default useMenus;
