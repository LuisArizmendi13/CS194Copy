import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRestaurantId } from "../aws-config";
import QRCodeComponent from "../components/QRCodeComponent"; // ✅ Import the QR Code component

const HomePage = () => {
  const { user } = useAuth();
  const [restaurantID, setRestaurantID] = useState("");

  useEffect(() => {
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          const restaurantId = getUserRestaurantId(session);
          setRestaurantID(restaurantId || "Unknown Restaurant");
        }
      });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to:</h1>
        <p className="text-lg text-gray-600 mt-2">{restaurantID}</p>

        {/* ✅ Use QR Code Component */}
        <QRCodeComponent restaurantID={restaurantID} />
      </div>
    </div>
  );
};

export default HomePage;
