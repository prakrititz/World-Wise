import React from 'react';
import { ArrowLeft } from 'lucide-react';

const tutorialSteps = [
  {
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    instruction: "Install Node.js and npm from the official website to set up your development environment"
  },
  {
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=800",
    instruction: "Open your terminal and create a new React project using 'npm create vite@latest'"
  },
  {
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    instruction: "Navigate to the project directory and install dependencies with 'npm install'"
  },
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    instruction: "Start the development server by running 'npm run dev' in your terminal"
  },
  {
    image: "https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&q=80&w=800",
    instruction: "Open your favorite code editor and start building your React components"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-[#232f3e]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button className="text-[#ff9900] hover:text-[#f2f2f2] flex items-center mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Overview
        </button>

        <div className="space-y-6">
          {tutorialSteps.map((step, index) => (
            <div 
              key={index}
              className="bg-[#f2f2f2] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6 flex items-center">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#146eb4] flex items-center justify-center">
                      <span className="text-white font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="px-8 py-3 bg-[#146eb4] text-white rounded-lg hover:bg-[#146eb4]/90 transition-colors">
            Complete Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;