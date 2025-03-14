import React, { useState, useEffect } from "react";
import { dynamoDb, TABLE_NAME } from "../aws-config";
import { useAuth } from "../context/AuthContext";

const OrdersPage = () => {
  const { user, session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !session) return; // Ensure user is authenticated

    const fetchOrders = async () => {
      try {
        const restaurantId = session.getIdToken().decodePayload()[
          "custom:restaurantID"
        ]; // ✅ Fetch restaurant ID
        const params = {
          TableName: TABLE_NAME,
          FilterExpression: "restaurantId = :rId AND attribute_exists(sales)",
          ExpressionAttributeValues: { ":rId": restaurantId },
        };

        const data = await dynamoDb.scan(params).promise();
        const allOrders = [];

        data.Items.forEach((dish) => {
          dish.sales.forEach((sale) => {
            allOrders.push({
              dishName: dish.name,
              quantity: sale.quantity,
              price: dish.price,
              time: sale.time,
            });
          });
        });

        setOrders(allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          "There was an error loading your orders. Please try refreshing the page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, session]);

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Order History
            </h1>
            <p className="text-sm text-gray-600">
              View and analyze your restaurant's order history
            </p>
          </div>
        </header>

        {/* Orders table */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No orders found.</p>
              </div>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-4 text-left text-sm">Dish</th>
                    <th className="py-2 px-4 text-center text-sm">Quantity</th>
                    <th className="py-2 px-4 text-center text-sm">
                      Total Price
                    </th>
                    <th className="py-2 px-4 text-center text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={index}
                      className={`border-t hover:bg-gray-50 transition ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-2 px-4 text-sm">{order.dishName}</td>
                      <td className="py-2 px-4 text-center text-sm">
                        {order.quantity}
                      </td>
                      <td className="py-2 px-4 text-center text-sm">
                        ${(order.price * order.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-center text-sm">
                        {new Date(order.time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <footer className="text-center text-gray-500 text-xs mt-6 mb-2">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
};

export default OrdersPage;
