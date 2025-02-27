import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <span className="text-xl font-bold">Menu Venue</span>
      <div className="space-x-4">
        <button className="hover:underline" onClick={() => navigate("/")}>Live Menu</button>
        <button className="hover:underline" onClick={() => navigate("/order")}>Order</button>
      </div>
    </nav>
  );
};

export default Navbar;
