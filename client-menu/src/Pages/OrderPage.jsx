import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <header className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Menu Venue</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                Order Confirmation
              </h1>
              <p className="text-sm text-gray-600">
                Your order has been placed successfully
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <button
                onClick={() => navigate("/")}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Menu
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-100 p-4">
              <h3 className="text-base font-bold text-gray-800">
                Order Status
              </h3>
            </div>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Order Successful
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your order has been received and is being processed by the
                restaurant.
              </p>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Order ID: ORDER-{Math.floor(100000 + Math.random() * 900000)}
                </p>
                <p className="text-sm text-gray-500">
                  Order Time: {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-100 p-4">
            <h3 className="text-base font-bold text-gray-800">What's Next?</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    1
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Processing
                  </h4>
                  <p className="text-sm text-gray-600">
                    The restaurant is preparing your order
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    2
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Ready for Pickup
                  </h4>
                  <p className="text-sm text-gray-600">
                    You'll be notified when your order is ready
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    3
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Enjoy!</h4>
                  <p className="text-sm text-gray-600">
                    Pickup your order at the restaurant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-xs mt-6 mb-2">
          <p>Menu Venue Customer Portal • {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default OrderPage;
