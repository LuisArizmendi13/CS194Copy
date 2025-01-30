import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar'; // Adjust path as needed
import DishesPage from './components/DishesPage'; // Import the DishesPage component
import ArchivePage from './components/ArchivePage'; // Import the ArchivePage component

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<div className="p-4">Welcome to the Home Page</div>} />
      <Route path="/page1" element={<div className="p-4">Welcome to Page 1</div>} />
      <Route path="/page2" element={<div className="p-4">Welcome to Page 2</div>} />
      <Route path="/dishes" element={<DishesPage />} /> {/* New Route */}
      <Route path="/archive" element={<ArchivePage />} /> {/* New Route */}
    </Routes>
  </Router>
);

export default App;
