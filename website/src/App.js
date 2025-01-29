import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar'; // Adjust path as needed
import DishesPage from './Pages/DishesPage'; // Import the DishesPage component
import LiveMenuPage from './Pages/LiveMenuPage'; 
const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<div className="p-4">Welcome to the Home Page</div>} />
      <Route path="/menus" element={<div className="p-4"></div>} />
      <Route path="/menu" element={<LiveMenuPage/>} />
      <Route path="/dishes" element={<DishesPage />} /> 
      <Route path="/analytics" element={<div className="p-4"></div>} />
    </Routes>
  </Router>
);

export default App;
