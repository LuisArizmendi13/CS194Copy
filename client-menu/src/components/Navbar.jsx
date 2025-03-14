import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Menu Venue</h1>
      </div>
    </header>
  );
};

export default Navbar;
