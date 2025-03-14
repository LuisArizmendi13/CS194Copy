import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import MenusPage from "./Pages/MenusPage"; // Import the new consolidated MenusPage
import MenuPage from "./Pages/MenuPage";
import MenuCreationPage from "./Pages/MenuCreationPage.jsx";
import ArchivePage from "./Pages/ArchivePage";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import OrdersPage from "./Pages/OrdersPage.jsx";
import AnalyticsPage from "./Pages/AnalyticsPage";
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
      {!isAuthPage && user && <Navbar />}
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/confirm" element={<ConfirmSignUp />} />

        {/* New consolidated menus route */}
        <Route
          path="/menus"
          element={<ProtectedRoute element={<MenusPage />} />}
        />

        {/* Redirects for old routes */}
        <Route path="/mymenus" element={<Navigate to="/menus?tab=menus" />} />
        <Route path="/dishes" element={<Navigate to="/menus?tab=dishes" />} />
        <Route path="/menu" element={<Navigate to="/menus?tab=live" />} />

        {/* Preserve other routes */}
        <Route
          path="/archive"
          element={<ProtectedRoute element={<ArchivePage />} />}
        />
        <Route
          path="/analytics"
          element={<ProtectedRoute element={<AnalyticsPage />} />}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute element={<OrdersPage />} />}
        />
        <Route
          path="/create-menu"
          element={<ProtectedRoute element={<MenuCreationPage />} />}
        />
        <Route
          path="/menus/:menuID"
          element={<ProtectedRoute element={<MenuPage />} />}
        />

        <Route path="*" element={<Navigate to="/" />} />
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
