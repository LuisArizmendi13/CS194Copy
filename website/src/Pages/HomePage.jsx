import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserRestaurantId } from "../aws-config";
import QRCodeComponent from "../components/QRCodeComponent";
import { Link } from "react-router-dom";

const fetchRestaurantData = () => ({
  name: "Foodie",
  address: "123 Main St, San Francisco, CA 94101",
});

const HomePage = () => {
  const { user } = useAuth();
  const [restaurantID, setRestaurantID] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          const restaurantId = getUserRestaurantId(session);
          setRestaurantID(restaurantId || "Foodie");

          setRestaurantData(fetchRestaurantData());
          setLoading(false);
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-lg font-medium text-gray-700 bg-white p-6 rounded shadow-sm">
          Redirecting to Sign In...
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Tutorial Box */}
        {showTutorial && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md shadow-sm mb-6 relative">
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-3 right-3 text-blue-700 hover:bg-blue-100 rounded p-1"
              aria-label="Close tutorial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🚀</span>
              <h3 className="text-lg font-medium text-blue-800">
                Welcome! Here's How to Use Your Dashboard
              </h3>
            </div>

            <p className="text-sm text-gray-700 mb-3 ml-1">
              Get started with these quick steps:
            </p>

            <div className="space-y-2 ml-1">
              <div className="flex items-start">
                <span className="text-base mr-2">📜</span>
                <div>
                  <Link
                    to="/menus"
                    className="text-base font-medium text-gray-800 hover:text-blue-600"
                  >
                    Menus
                  </Link>
                  <p className="text-sm text-gray-600">
                    Create & manage your restaurant's menus.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-base mr-2">📊</span>
                <div>
                  <Link
                    to="/analytics"
                    className="text-base font-medium text-gray-800 hover:text-blue-600"
                  >
                    Analytics
                  </Link>
                  <p className="text-sm text-gray-600">
                    View your restaurant's data.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-base mr-2">🗂️</span>
                <div>
                  <Link
                    to="/archive"
                    className="text-base font-medium text-gray-800 hover:text-blue-600"
                  >
                    Archive
                  </Link>
                  <p className="text-sm text-gray-600">
                    View historical menus and sales data.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-base mr-2">📦</span>
                <div>
                  <Link
                    to="/orders"
                    className="text-base font-medium text-gray-800 hover:text-blue-600"
                  >
                    Orders
                  </Link>
                  <p className="text-sm text-gray-600">
                    View & manage recent orders.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-base mr-2">💡</span>
                <div>
                  <span className="text-base font-medium text-gray-800">
                    AI Suggestions
                  </span>
                  <p className="text-sm text-gray-600">
                    Get smart recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Card */}
        <div className="bg-white rounded-md shadow-sm mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Left content */}
            <div className="p-6 flex-grow">
              <div className="flex items-start mb-5">
                <div className="w-16 h-16 bg-green-500 rounded-md flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {restaurantData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {restaurantData.name}
                  </h2>
                  <p className="text-gray-600 flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {restaurantData.address}
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4 mb-5">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome to your dashboard!
                </h1>
                <p className="text-gray-600 text-base">
                  Your AI-powered menu platform is actively optimizing your menu
                  for better performance.
                </p>
              </div>

              {/* Quick action buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                <Link
                  to="/menus"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <span className="text-2xl mb-2">📋</span>
                  <span className="text-base font-medium">Edit Menu</span>
                </Link>
                <Link
                  to="/analytics"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <span className="text-2xl mb-2">📊</span>
                  <span className="text-base font-medium">Analytics</span>
                </Link>
                <Link
                  to="/archive"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <span className="text-2xl mb-2">🗂️</span>
                  <span className="text-base font-medium">Archive</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <span className="text-2xl mb-2">🛒</span>
                  <span className="text-base font-medium">Orders</span>
                </Link>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-50 p-6 md:border-l border-gray-100 flex-shrink-0 md:w-72">
              <QRCodeComponent restaurantID={restaurantID} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            Data last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
