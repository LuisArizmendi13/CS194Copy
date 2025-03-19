import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Navigation component for menu-related pages
 * Uses nested routes under /menus/
 */
const MenuNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define the navigation items with paths matching the App.js routes
  const navItems = [
    { path: "/menus/live-menu", label: "Live Menu" },
    { path: "/menus/my-menus", label: "My Menus" },
    { path: "/menus/dish-library", label: "Dish Library" },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm mb-4">
      <div className="flex border-b">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 text-base font-medium ${
              currentPath === item.path
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuNav;