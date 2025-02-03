import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import DishDetailsPage from './components/DishDetailsPage';
import DishesPage from './components/DishesPage';
import { Navbar } from './components/navbar'; // Adjust path as needed
import ArchivePage from './components/ArchivePage';

const App = () => {
  const [dishes, setDishes] = useState([]);

  const addDish = (dish) => {
    setDishes([...dishes, dish]);
  };

  return (
    <Router>
      <Navbar />
    <Routes>
      <Route path="/" element={<div className="p-4">Welcome to the Home Page</div>} />
      <Route path="/page1" element={<div className="p-4">Welcome to Page 1</div>} />
      <Route path="/page2" element={<div className="p-4">Welcome to Page 2</div>} />
      <Route path="/dishes" element={<DishesPage />} /> {/* New Route */}
      <Route path="/archive" element={<ArchivePage/>}/>{/* New Route */}
    </Routes>
      <Routes>
      <Route path="/menu" element={<MenuPage dishes={dishes} />} />
        <Route path="/dish/:id" element={<DishDetailsPage dishes={dishes} />} />
        <Route path="/add-dish" element={<DishesPage addDish={addDish} />} />
      </Routes>
    </Router>
  );
};

export default App;
