import React from 'react';
import DishBox from './DishBox';

const SelectableDishList = ({ dishes, onDishSelect, selectedDishes }) => {
  return (
    <div className="mt-4">
      {dishes.map((dish) => (
        <DishBox
          key={dish.dishId}
          dish={dish}
          onDishSelect={onDishSelect}
          isSelected={selectedDishes.has(dish.dishId)}
          isSelectable={true} // Indicates this is used for selection
        />
      ))}
    </div>
  );
};

export default SelectableDishList;
