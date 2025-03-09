import React, { useState, useEffect } from "react";
import { dynamoDb, TABLE_NAME } from "../aws-config";
import { useAuth } from "../context/AuthContext";

const OrdersPage = () => {
  const { user, session } = useAuth(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !session) return; // Ensure user is authenticated

    const fetchOrders = async () => {
      try {
        const restaurantId = session.getIdToken().decodePayload()["custom:restaurantID"]; // ✅ Fetch restaurant ID
        const params = {
          TableName: TABLE_NAME,
          FilterExpression: "restaurantId = :rId AND attribute_exists(sales)",
          ExpressionAttributeValues: { ":rId": restaurantId }
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, session]);

  return (
    <div className="p-6 mx-auto" style={{ maxWidth: "800px" }}>
      <h2 className="text-2xl font-bold text-center mb-4">Order History</h2>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-2 px-4">Dish</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total Price</th>
                <th className="py-2 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-t text-center">
                  <td className="py-2 px-4">{order.dishName}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">${(order.price * order.quantity).toFixed(2)}</td>
                  <td className="py-2 px-4">{new Date(order.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
