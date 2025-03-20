import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import MenusPage from "./Pages/Menus/MenuIndex"; // Acts as router/redirect component
import LiveMenuPage from "./Pages/Menus/LiveMenuPage";
import MyMenusPage from "./Pages/Menus/MyMenusPage";
import DishesPage from "./Pages/Menus/DishLibraryPage";
import MenuPage from "./Pages/MenuPage";
import MenuCreationPage from "./Pages/MenuCreationPage";
import ArchivePage from "./Pages/ArchivePage";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import OrdersPage from "./Pages/OrdersPage";
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

        {/* Menu routes with nested structure */}
        <Route
          path="/menus"
          element={<ProtectedRoute element={<MenusPage />} />}
        />
        <Route
          path="/menus/live-menu"
          element={<ProtectedRoute element={<LiveMenuPage />} />}
        />
        <Route
          path="/menus/my-menus"
          element={<ProtectedRoute element={<MyMenusPage />} />}
        />
        <Route
          path="/menus/dish-library"
          element={<ProtectedRoute element={<DishesPage />} />}
        />

        {/* Redirects for old routes */}
        <Route path="/mymenus" element={<Navigate to="/menus/my-menus" />} />
        <Route path="/dishes" element={<Navigate to="/menus/dish-library" />} />
        <Route path="/menu" element={<Navigate to="/menus/live-menu" />} />
        
        {/* Note: Query parameters (?tab=live) are handled in the 
            MenusPage component's useEffect, not here in the router */}

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