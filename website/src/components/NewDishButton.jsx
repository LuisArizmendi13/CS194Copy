import React from 'react';

const NewDishButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6 float-right block">
      + New Dish
    </button>
  );
};

export default NewDishButton;
