import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveMenuPage from "./Pages/LiveMenuPage";
import OrderPage from "./Pages/OrderPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LiveMenuPage />} />
      <Route path="/order" element={<OrderPage />} />
    </Routes>
  </Router>
);

export default App;
