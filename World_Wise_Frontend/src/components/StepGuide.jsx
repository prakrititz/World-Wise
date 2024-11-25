import React from "react";
import Chatbot from "./Chatbot";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const StepGuide = () => {
  const steps = [
    {
      title: "Select Product and Target Country",
      description: "Identify your product's potential in international markets",
    },
    {
      title: "Understand Compliance Requirements",
      description: "Navigate regulatory frameworks and certification needs",
    },
    {
      title: "Prepare Documentation",
      description: "Complete all necessary export documentation accurately",
    },
    {
      title: "Shipping and Logistics",
      description: "Coordinate efficient transportation and delivery",
    },
    {
      title: "Receive Payments",
      description: "Secure international transactions and payments",
    },
  ];

  return (
    <div className="container mx-auto py-24 px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
        Your Path to Export Success
      </h2>
      <div className="max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start mb-8 relative">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
              {index + 1}
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Chatbot/>
    </div>
  );
};

export default StepGuide;
