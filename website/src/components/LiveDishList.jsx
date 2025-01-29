import React from 'react';
import LiveDishBox from './LiveDishBox';

const LiveDishList = ({ dishes }) => {
  return (
    <div className="mt-4">
      {dishes.map((dish, index) => (
        <LiveDishBox key={index} dish={dish} />
      ))}
    </div>
  );
};

export default LiveDishList;
