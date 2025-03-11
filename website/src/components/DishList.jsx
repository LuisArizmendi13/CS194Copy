// In DishList.js
import React from 'react';
import DishBox from './DishBox';

const DishList = ({ dishes, onArchiveChange, onSaleRecorded, onDelete }) => {
  return (
    <div>
      {dishes.map((dish) => (
        <DishBox
          key={dish.dishId}
          dish={dish}
          onDishSelect={() => console.log('Selecting dish')} // Implement onDishSelect if needed
          isSelected={false} // Implement isSelected if needed
          isSelectable={false} // Implement isSelectable if needed
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DishList;
