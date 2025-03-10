import React from 'react';
import DishBox from './DishBox';

const DishList = ({ dishes, onArchiveChange, onSaleRecorded, onDelete }) => {
  return (
    <div className="mt-4">
      {dishes.map((dish) => (
        <DishBox 
          key={dish.dishId} 
          dish={dish} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DishList;
