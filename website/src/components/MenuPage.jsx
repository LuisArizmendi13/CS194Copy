// DishesListPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const MenuPage = ({ dishes }) => {
  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <h1 className="text-2xl font-bold mb-4">Menu</h1>
      {dishes.map((dish, index) => (
        <div key={index} className="border rounded p-4 mb-4 shadow">
          <h2 className="text-lg font-bold">{dish.name}</h2>
          <p className="text-gray-600">${dish.price.toFixed(2)}</p>
          <Link to={`/dish/${index}`} className="text-blue-500 hover:underline">
            View Details
          </Link>
        </div>
      ))}
      <Link to="/add-dish" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 inline-block">
        + New Dish
      </Link>
    </div>
  );
};

export default MenuPage;
