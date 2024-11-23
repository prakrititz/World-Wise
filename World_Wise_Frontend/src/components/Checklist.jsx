import React, { useState, useEffect } from 'react';
import { Check, Circle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
const Checklist = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expandedGuides, setExpandedGuides] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage = input.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInput(''); // Clear input immediately after sending
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Add bot response
        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.response
        }]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "Sorry, I'm having trouble connecting right now. Please make sure the backend server is running on port 8000."
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const ChatMessages = ({ messages }) => (
    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`mb-6 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.type === 'bot' && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-600 text-sm">A</span>
            </div>
          )}
          <div 
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            {msg.type === 'user' ? (
              <div className="text-sm">{msg.content}</div>
            ) : (
              <div className="text-sm">
                {formatMessage(msg.content)}
              </div>
            )}
          </div>
          {msg.type === 'user' && (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
              <span className="text-white text-sm">U</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
    const formatMessage = (content) => {
    return (
      <ReactMarkdown 
        className="prose prose-sm prose-invert max-w-none"
        components={{
          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
          p: ({node, ...props}) => <p className="mb-2 text-sm" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          code: ({node, ...props}) => <code className="bg-gray-800 px-1 rounded" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  const checklistItems = [
    {
      id: 1,
      title: "Essential Documentation",
      items: [
        { 
          id: "pan",
          name: "PAN Card",
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
        { id: "iec", name: "IEC Code", description: "Import Export Code from DGFT" },
        { id: "gstin", name: "GSTIN", description: "GST Registration Number" }
      ]
    },
    {
      id: 2,
      title: "Banking & Finance",
      items: [
        { id: "adcode", name: "AD Code", description: "Authorized Dealer Code from Bank" },
        { id: "firc", name: "FIRC", description: "Foreign Inward Remittance Certificate" },
        { id: "bank", name: "Bank Account", description: "Current Account for Export Business" }
      ]
    },
    {
      id: 3,
      title: "Product Compliance",
      items: [
        { id: "quality", name: "Quality Certification", description: "Product Quality Standards" },
        { id: "license", name: "Export License", description: "If required for your product" },
        { id: "hscode", name: "HS Code", description: "Harmonized System Code for your product" }
      ]
    }
  ];

  const handleGuideToggle = (itemId) => {
    setExpandedGuides(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCompletion = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isSectionComplete = (section) => {
    return section.items.every(item => completedItems[item.id]);
  };

  const isAllComplete = () => {
    return checklistItems.every(section => isSectionComplete(section));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          Export Readiness Checkpoints
        </h1>
        
        {isAllComplete() && (
          <div className="mb-8 p-6 bg-green-500/20 backdrop-blur-lg rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-white mb-2">🎉 Congratulations!</h2>
            <p className="text-white text-lg">You're all set to export your product!</p>
          </div>
        )}

        <div className="flex flex-col gap-8 mb-24">
          {checklistItems.map((section) => (
            <div key={section.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-6 h-6">
                  {isSectionComplete(section) ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-yellow-400" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-yellow-400">
                  {section.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <div className="flex items-start space-x-4 p-4 hover:bg-white/5 rounded-lg transition-all">
                      <button
                        onClick={() => toggleCompletion(item.id)}
                        className="mt-1 focus:outline-none"
                      >
                        <div className="flex items-center justify-center w-5 h-5">
                          {completedItems[item.id] ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      </button>
                      <div 
                        className="cursor-pointer flex-1"
                        onClick={() => handleGuideToggle(item.id)}
                      >
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-blue-100 text-sm">{item.description}</p>
                      </div>
                    </div>
                    {expandedGuides[item.id] && item.guide && (
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
          <div className="bg-white rounded-2xl shadow-2xl w-[400px]">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">A</span>
                </div>
                <div>
                  <h3 className="font-bold">Ani</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <ChatMessages messages={messages} />
            
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleChatSubmit}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask about export requirements..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-full text-white transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
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
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-xl hover:bg-blue-200">
              <span className="text-blue-600 text-2xl">A</span>
            </div>
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default Checklist;