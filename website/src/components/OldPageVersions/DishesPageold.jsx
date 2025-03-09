import React, { useState, useEffect } from 'react';
import { dynamoDb, TABLE_NAME } from '../../aws-config';

// Add Dish Popup Component
const AddDishPopup = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient("");
    }
  };

  const saveDish = async () => {
    if (name && price && ingredients.length > 0) {
      const dish = { name, price: parseFloat(price), ingredients, archive: false, sales: [], dishId: `${Date.now()}` };
      const params = { TableName: TABLE_NAME, Item: dish };
      try {
        await dynamoDb.put(params).promise();
        onSave(dish);
        onClose();
      } catch (error) {
        console.error("Error saving dish to DynamoDB:", error);
      }
    } else {
      alert("Please fill in all fields and add at least one ingredient.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg text-lg font-bold">Add New Dish</div>
        <div className="p-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter dish name" className="w-full p-2 border rounded mb-2" />
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="w-full p-2 border rounded mb-2" />
          <input type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Enter ingredient" className="w-full p-2 border rounded mb-2" />
          <button onClick={addIngredient} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Ingredient</button>
          <ul className="mt-2">
            {ingredients.map((ing, index) => <li key={index} className="text-sm text-gray-600">- {ing}</li>)}
          </ul>
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
            <button onClick={saveDish} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dish Box Component
const DishBox = ({ dish, onArchiveChange, onSaleRecorded }) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const [salesCount, setSalesCount] = useState(dish.sales?.length || 0);
  const [isArchived, setIsArchived] = useState(dish?.archive ?? false);

  useEffect(() => {
    setSalesCount(dish.sales?.length || 0);
    setIsArchived(dish?.archive ?? false);
  }, [dish]);

  const recordSale = async () => {
    const sale = { time: new Date().toISOString(), price: dish.price };
    const updatedSales = [...(dish.sales || []), sale];

    const params = {
      TableName: TABLE_NAME,
      Key: { dishId: dish.dishId },
      UpdateExpression: "set sales = :sales",
      ExpressionAttributeValues: { ":sales": updatedSales },
      ReturnValues: "UPDATED_NEW"
    };
    try {
      await dynamoDb.update(params).promise();
      setSalesCount(updatedSales.length);
      onSaleRecorded(dish.dishId, updatedSales);
    } catch (error) {
      console.error("Error recording sale:", error);
    }
  };

  const handleArchiveChange = async (event) => {
    const newStatus = !event.target.checked;
    setIsArchived(newStatus);

    const params = {
      TableName: TABLE_NAME,
      Key: { dishId: dish.dishId },
      UpdateExpression: "set #archive = :archiveStatus",
      ExpressionAttributeNames: { "#archive": "archive" },
      ExpressionAttributeValues: { ":archiveStatus": newStatus },
      ReturnValues: "UPDATED_NEW"
    };
    try {
      await dynamoDb.update(params).promise();
      onArchiveChange(dish.dishId, newStatus);
    } catch (error) {
      console.error("Error updating archive status:", error);
    }
  };

  return (
    <div className="border rounded p-4 flex justify-between items-center mb-4 shadow">
      <div>
        <div className="text-lg font-bold">{dish.name || "Unknown Dish"}</div>
        <div className="text-gray-600">${dish.price ? dish.price.toFixed(2) : "0.00"}</div>
        <div className="text-gray-600">Sales: {salesCount}</div>
        {showIngredients && <ul className="mt-2">{dish.ingredients.map((ing, index) => <li key={index} className="text-sm text-gray-600">- {ing}</li>)}</ul>}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input type="checkbox" checked={!isArchived} onChange={handleArchiveChange} className="mr-2" />
          Active
        </label>
        <button onClick={recordSale} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Record Sale</button>
        <button onClick={() => setShowIngredients(!showIngredients)} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          {showIngredients ? "Hide Ingredients" : "Show Ingredients"}
        </button>
      </div>
    </div>
  );
};

// Dishes Page Component
const DishesPage = () => {
  const [dishes, setDishes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      const params = { TableName: TABLE_NAME };
      try {
        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          setDishes(data.Items);
        }
      } catch (error) {
        console.error("Error fetching dishes from DynamoDB:", error);
      }
    };
    fetchDishes();
  }, []);

  const addDish = (dish) => {
    setDishes([...dishes, dish]);
  };

  const updateSales = (dishId, updatedSales) => {
    setDishes((prevDishes) => prevDishes.map((d) => d.dishId === dishId ? { ...d, sales: updatedSales } : d));
  };

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: '1124px' }}>
      <button onClick={() => setShowPopup(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6 float-right block">+ New Dish</button>
      <div style={{ clear: 'both' }}></div>
      {dishes.map((dish, index) => (
        <DishBox key={index} dish={dish} onArchiveChange={(id, status) => {
          setDishes((prevDishes) => prevDishes.map((d) => d.dishId === id ? { ...d, archive: status } : d));
        }} onSaleRecorded={updateSales} />
      ))}
      {showPopup && <AddDishPopup onClose={() => setShowPopup(false)} onSave={addDish} />}
    </div>
  );
};

export default DishesPage;
