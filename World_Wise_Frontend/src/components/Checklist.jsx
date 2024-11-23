import React, { useState } from 'react';
import { FaCircle } from 'react-icons/fa';

const Checklist = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expandedGuides, setExpandedGuides] = useState({});

  const handleGuideToggle = (itemName) => {
    setExpandedGuides(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const checklistItems = [
    {
      id: 1,
      title: "Essential Documentation",
      items: [
        { name: "PAN Card",
            description: "Permanent Account Number for tax identification",
            guide: `1. Decide the Type of PAN
    - For Individuals: Personal PAN
    - For Businesses: PAN for Proprietorship, Partnership, LLP, Company, Trust, etc.
    
    2. Gather Required Documents
    For Individuals:
    - Identity Proof: Aadhaar card, voter ID, passport, or driving license
    - Address Proof: Aadhaar, utility bill, or passport
    - Date of Birth Proof: Birth certificate, school leaving certificate, or Aadhaar
    - Photograph: Passport-size
    
    3. Apply Online
    - Visit NSDL e-Gov or UTIITSL portal
    - Fill Form 49A/49AA
    - Upload documents
    - Pay fee (₹110 for Indian address)
    - Complete e-KYC
    - Track status with acknowledgment number
    
    4. Receive PAN
    - E-PAN within 48 hours
    - Physical card within 15 days`
          },
        { name: "IEC Code", description: "Import Export Code from DGFT" },
        { name: "GSTIN", description: "GST Registration Number" }
      ]
    },
    {
      id: 2,
      title: "Banking & Finance",
      items: [
        { name: "AD Code", description: "Authorized Dealer Code from Bank" },
        { name: "FIRC", description: "Foreign Inward Remittance Certificate" },
        { name: "Bank Account", description: "Current Account for Export Business" }
      ]
    },
    {
      id: 3,
      title: "Product Compliance",
      items: [
        { name: "Quality Certification", description: "Product Quality Standards" },
        { name: "Export License", description: "If required for your product" },
        { name: "HS Code", description: "Harmonized System Code for your product" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Export Readiness Checkpoints
        </h1>
        
        {/* Single Row Layout */}
        <div className="flex flex-col gap-8 mb-24">
          {checklistItems.map((section) => (
            <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-6 text-yellow-400">
                {section.title}
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {section.items.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-start space-x-4 p-4 hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                         onClick={() => handleGuideToggle(item.name)}>
                      <FaCircle className="text-yellow-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-blue-100 text-sm">{item.description}</p>
                      </div>
                    </div>
                    {expandedGuides[item.name] && (
                      <div className="mt-4 p-6 bg-white/5 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm text-blue-50">
                          {item.guide}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Assistant */}
        <div className="fixed bottom-8 right-8 z-50">
          {showChat ? (
            <div className="bg-white rounded-2xl shadow-2xl w-96">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img 
                    src="./images/ai-bot.png" 
                    alt="Ani" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Ani</h3>
                    <p className="text-sm text-gray-600">Export Assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                </button>
              </div>
              <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : ''}`}>
                    <span className={`inline-block px-4 py-2 rounded-2xl ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) {
                    setMessages([...messages, { type: 'user', content: input }]);
                    setInput('');
                    setTimeout(() => {
                      setMessages(prev => [...prev, {
                        type: 'bot',
                        content: "I'll help guide you through the export process!"
                      }]);
                    }, 1000);
                  }
                }}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ask about export requirements..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
<button
  onClick={() => setShowChat(true)}
  className="transform transition-all duration-300 hover:scale-105"
>
  <img
    src="/images/ai-bot.png"
    alt="Chat with Ani"
    className="w-48 h-48 p-4 backdrop-blur-lg bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 shadow-xl"
  />
</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;
