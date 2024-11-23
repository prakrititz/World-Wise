import React from "react";
import { FaRoute, FaRobot, FaFileContract, FaChartLine } from "react-icons/fa";

const Features = () => {
  const features = [
    { icon: <FaRoute className="w-8 h-8" />, title: "Step-by-step Export Guidance", description: "Clear pathways and detailed guidance for successful international trade" },
    { icon: <FaRobot className="w-8 h-8" />, title: "AI-Powered Assistance", description: "Smart solutions to streamline your export processes" },
    { icon: <FaFileContract className="w-8 h-8" />, title: "Regulatory Information", description: "Stay compliant with up-to-date regulatory requirements" },
    { icon: <FaChartLine className="w-8 h-8" />, title: "Risk Assessment", description: "Comprehensive risk analysis and mitigation strategies" },
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Powerful Features for Global Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;