import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">World Wise</h1>
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/guide">Step-by-Step</Link>
          <Link to="/ai-companion">AI Companion</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
