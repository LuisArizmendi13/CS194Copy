export const getCategories = (liveMenu) => {
  if (!liveMenu || !liveMenu.dishes) return [];
  const categoriesSet = new Set(liveMenu.dishes.map((dish) => dish.category || "Uncategorized"));
  return ["all", ...Array.from(categoriesSet)];
};

export const getFilteredDishes = (liveMenu, selectedCategory) => {
  if (!liveMenu || !liveMenu.dishes) return [];
  if (selectedCategory === "all") return liveMenu.dishes;
  return liveMenu.dishes.filter((dish) => dish.category === selectedCategory);
};

/**
* Generates a unique ID for a new menu
* @returns {string} A unique menu ID
*/
export function generateMenuId() {
  return `menu-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
