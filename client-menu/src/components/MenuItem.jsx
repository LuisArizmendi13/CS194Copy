const MenuItem = ({ dish, quantity, setQuantities }) => {
    const handleQuantityChange = (amount) => {
      setQuantities((prev) => ({
        ...prev,
        [dish.name]: Math.max(0, prev[dish.name] + amount),
      }));
    };
  
    return (
      <div className="p-4 flex justify-between">
        <div>
          <h4 className="text-base font-medium">{dish.name}</h4>
          <p className="text-sm text-gray-600">${dish.price?.toFixed(2)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="w-6 h-6 bg-gray-200 rounded-full" onClick={() => handleQuantityChange(-1)}>-</button>
          <span className="w-6 text-center">{quantity}</span>
          <button className="w-6 h-6 bg-gray-200 rounded-full" onClick={() => handleQuantityChange(1)}>+</button>
        </div>
      </div>
    );
  };
  
  export default MenuItem;
  