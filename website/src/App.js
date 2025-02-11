import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import MenuPage from './components/MenuPage';
//import DishDetailsPage from './components/DishDetailsPage';
//import DishesPage from './components/DishesPage';
import { Navbar } from './components/navbar'; // Adjust path as needed
import DishesPage from './Pages/DishesPage'; // Import the DishesPage component
import LiveMenuPage from './Pages/LiveMenuPage'; 
import ArchivePage from './components/ArchivePage'; 

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<div className="p-4">Welcome to the Home Page</div>} />
      <Route path="/menus" element={<div className="p-4"></div>} />
      <Route path="/menu" element={<LiveMenuPage/>} />
      <Route path="/dishes" element={<DishesPage />} /> 
      <Route path="/analytics" element={<div className="p-4"></div>} /> 
      <Route path="/archive" element={<ArchivePage/>}/>
    </Routes>
    </Router>
  );

export default App;
/*
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
      <Route path="/dishes" element={<DishesPage />} /> {/* New Route *//*}
      <Route path="/archive" element={<ArchivePage/>}/>{/* New Route *//*} */