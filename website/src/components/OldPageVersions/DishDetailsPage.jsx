// DishDetailsPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const DishDetailsPage = ({ dishes }) => {
  const { id } = useParams();
  const dish = dishes[id];

  if (!dish) {
    return <div>Dish not found</div>;
  }

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <h1 className="text-2xl font-bold mb-4">{dish.name}</h1>
      <p className="text-gray-600 mb-2">Price: ${dish.price.toFixed(2)}</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Ingredients:</h2>
      <ul className="list-disc pl-5">
        {dish.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 inline-block">
        Back to List
      </Link>
    </div>
  );
};

export default DishDetailsPage;
