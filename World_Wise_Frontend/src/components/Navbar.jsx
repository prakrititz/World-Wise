import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#000000] text-[#f2f2f2] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#ff9900]">World Wise</h1>
        <div className="space-x-6">
          <Link to="/" className="hover:text-[#ff9900] transition-colors">Home</Link>
          <Link to="/guide" className="hover:text-[#ff9900] transition-colors">Step-by-Step</Link>
          <Link to="/ai-companion" className="hover:text-[#ff9900] transition-colors">AI Companion</Link>
          <Link to="/contact" className="hover:text-[#ff9900] transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
