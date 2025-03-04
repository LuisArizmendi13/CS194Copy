import React from "react";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const OrderPage = () => {
  return (
    <div>
      <Navbar /> {/* ✅ Added Navbar */}
      <div className="p-6 mx-auto text-center" style={{ maxWidth: "800px" }}>
        <h2 className="text-2xl font-bold mb-4">Order Page</h2>
        <p className="text-gray-600">Order functionality coming soon...</p>
      </div>
    </div>
  );
};

export default OrderPage;
