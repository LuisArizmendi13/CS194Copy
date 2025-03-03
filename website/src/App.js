import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import HomePage from "./Pages/HomePage"; // ✅ Import Home Page
import MyMenusPage from "./Pages/MyMenusPage";
import MenuPage from "./Pages/MenuPage";
import MenuCreationPage from "./Pages/MenuCreationPage";
import DishesPage from "./Pages/DishesPage";
import LiveMenuPage from "./Pages/LiveMenuPage";
import ArchivePage from "./Pages/ArchivePage";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn"; 
import AnalyticsPage from "./components/Analytics/AnalyticsPage"
import ConfirmSignUp from "./Pages/ConfirmSignUp";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" />;
};

const AppContent = () => {
  const { user } = useAuth();
  const isAuthPage =
    window.location.pathname === "/signin" ||
    window.location.pathname === "/signup" ||
    window.location.pathname === "/confirm";

  return (
    <Router>
      {!isAuthPage && user && <Navbar />} {/* ✅ Show Navbar only if signed in */}
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/mymenus" element={<MyMenusPage />} />
        <Route path="/confirm" element={<ConfirmSignUp />} />
        <Route path="/dishes" element={<ProtectedRoute element={<DishesPage />} />} />
        <Route path="/menu" element={<ProtectedRoute element={<LiveMenuPage />} />} />
        <Route path="/archive" element={<ProtectedRoute element={<ArchivePage />} />} /> 
        <Route path="/analytics" element={<ProtectedRoute element={<AnalyticsPage />} />} /> 
        <Route path="/create-menu" element={<MenuCreationPage />} /> 
        <Route path="/menus/:menuID" element={<MenuPage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* ✅ Catch-all for unknown routes */}
      </Routes>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
/*
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import MenuPage from './components/MenuPage';
//import DishDetailsPage from './components/DishDetailsPage';
//import DishesPage from './components/DishesPage';
import { Navbar } from "./components/navbar"; // Adjust path as needed
import DishesPage from "./Pages/DishesPage"; // Import the DishesPage component
import LiveMenuPage from "./Pages/LiveMenuPage";
import ArchivePage from "./components/ArchivePage";
import AnalyticsPage from "./components/Analytics/AnalyticsPage";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route
        path="/"
        element={<div className="p-4">Welcome to the Home Page</div>}
      />
      <Route path="/menus" element={<div className="p-4"></div>} />
      <Route path="/menu" element={<LiveMenuPage />} />
      <Route path="/dishes" element={<DishesPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />{" "}
      {/* New Route for Analytics *//*}
     <Route path="/archive" element={<ArchivePage />} />{" "}
      {/* New Route for Archive *//*} 
    </Routes>
  </Router>
);

export default App;
*/
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
      <Route path="/dishes" element={<DishesPage />} /> {/* New Route */
//<Route path="/archive" element={<ArchivePage/>}/>{/* New Route */ /*} */
