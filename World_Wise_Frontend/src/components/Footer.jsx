import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  return (
    <footer className="bg-[#232f3e] text-[#f2f2f2] py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[#ff9900] font-bold text-xl mb-2">World Wise</h3>
            <p className="text-[#f2f2f2]">&copy; 2024 All Rights Reserved.</p>
          </div>
          <div className="flex space-x-8">
            <div>
              <h4 className="text-[#ff9900] font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-[#ff9900]">Home</a></li>
                <li><a href="#" className="hover:text-[#ff9900]">Services</a></li>
                <li><a href="#" className="hover:text-[#ff9900]">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#ff9900] font-semibold mb-2">Contact</h4>
              <ul className="space-y-1">
                <li>support@worldwise.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
