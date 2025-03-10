import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import HomePage from "./Pages/HomePage"; // ✅ Import Home Page
import MyMenusPage from "./Pages/MyMenusPage";
import MenuPage from "./Pages/MenuPage";
import MenuCreationPage from "./Pages/MenuCreationPage.jsx";
import DishesPage from "./Pages/DishesPage";
import LiveMenuPage from "./Pages/LiveMenuPage";
import ArchivePage from "./Pages/ArchivePage";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn"; 
import OrdersPage from "./Pages/OrdersPage.jsx";
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
        <Route path="/orders" element={<ProtectedRoute element={<OrdersPage />} />} />  
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
