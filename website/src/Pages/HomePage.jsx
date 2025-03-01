import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRestaurantId } from "../aws-config"; // ✅ Fetch restaurant ID

const HomePage = () => {
  const { user } = useAuth();
  const [restaurantID, setRestaurantID] = useState("");

  useEffect(() => {
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          //console.log("✅ Session Found:", session);
          const restaurantId = getUserRestaurantId(session);
          console.log("✅ Retrieved Restaurant ID:", restaurantId);
          setRestaurantID(restaurantId || "Unknown Restaurant");
        } else {
          console.log("❌ No valid session found.");
        }
      });
    } else {
      console.log("❌ User not found.");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-700">
        Redirecting to Sign In...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to:</h1>
        <p className="text-lg text-gray-600 mt-2">{restaurantID}</p>
      </div>
    </div>
  );
};

export default HomePage;
