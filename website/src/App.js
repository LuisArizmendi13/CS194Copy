import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<div className="p-4">Welcome to the Home Page</div>} />
      <Route path="/page1" element={<div className="p-4">Welcome to Page 1</div>} />
      <Route path="/page2" element={<div className="p-4">Welcome to Page 2</div>} />
    </Routes>
  </Router>
);

export default App;
