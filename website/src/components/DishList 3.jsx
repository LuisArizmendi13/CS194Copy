import React from 'react';
import DishBox from './DishBox';

const DishList = ({ dishes, onArchiveChange, onSaleRecorded }) => {
  return (
    <div className="mt-4">
      {dishes.map((dish, index) => (
        <DishBox key={index} dish={dish} onArchiveChange={onArchiveChange} onSaleRecorded={onSaleRecorded} />
      ))}
    </div>
  );
};

export default DishList;
