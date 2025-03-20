import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useMenus from "../../hooks/useMenus";

/**
 * Legacy component that redirects to the appropriate menu sub-page
 * This maintains backward compatibility with existing links and bookmarks
 */
const MenusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session } = useAuth();
  const { liveMenu, loading } = useMenus(session);

  useEffect(() => {
    if (!user || loading) return; // Wait until user and menus are loaded
    
    // If already on a sub-route, don't redirect
    if (location.pathname !== "/menus") {
      return;
    }
    
    // Parse the query parameters to check for tab
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get("tab");

    // Redirect based on the tab parameter
    if (tabParam === "live") {
      navigate("/menus/live-menu", { replace: true });
    } else if (tabParam === "menus") {
      navigate("/menus/my-menus", { replace: true });
    } else if (tabParam === "dishes") {
      navigate("/menus/dish-library", { replace: true });
    } else {
      // Default redirect logic: 
      // If there's a live menu, go to live menu page, otherwise go to my menus
      if (liveMenu) {
        navigate("/menus/live-menu", { replace: true });
      } else {
        navigate("/menus/my-menus", { replace: true });
      }
    }
  }, [location.pathname, location.search, navigate, user, liveMenu, loading]);

  // Only show loading if we're at the exact /menus path
  if (location.pathname === "/menus") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirecting...</p>
      </div>
    );
  }

  // If we're on a sub-path, don't render anything as the sub-route component will handle rendering
  return null;
};

export default MenusPage;