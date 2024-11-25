import React, { useState, useEffect,useRef } from 'react';
import { Trophy, CheckCircle2, Lock, X, ChevronRight, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

// Checklist Data
// PathStep Component
const PathStep = ({ index, title, isCompleted, isActive, onClick, totalSteps }) => {
  const isLocked = index > 0 && !isCompleted;
  return (
    <div
      className="flex flex-col items-center px-2"
      style={{ width: `${100/totalSteps}%` }}
    >
      <button
        onClick={onClick}
        disabled={isLocked}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          transform transition-all duration-300
          ${isActive ? 'scale-110' : 'hover:scale-105'}
          ${isCompleted 
            ? 'bg-green-500 shadow-lg shadow-green-400/50'
            : isLocked
              ? 'bg-yellow-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg shadow-blue-500/50'}
        `}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-8 h-8 text-blue-900" />
        ) : isLocked ? (
          <Lock className="w-6 h-6" />
        ) : (
          <span className="text-xl font-bold text-white">{index + 1}</span>
        )}
      </button>
      <div className="mt-4 text-center">
        <h3 className={`font-semibold ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
          {title}
        </h3>
      </div>
    </div>
  );
  
};

// StepModal Component
const StepModal = ({ step, onClose, onComplete, stepNumber, totalSteps }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-blue-400 text-sm mb-1">{step.sectionTitle}</p>
            <h2 className="text-2xl font-bold text-white">{step.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
  <p className="text-gray-300 mb-8">{step.description}</p>

  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xl font-bold text-white">Step-by-Step Guide</h3>
    <button
      onClick={() => navigate(`/detailed-guide/${step.name}`)}
      className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-all flex items-center gap-2"
    >
      <span>Detailed Guide</span>
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>

          {step.guide?.map((section, idx) => (
            <div 
              key={idx}
              className="mb-8 bg-white/5 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-3 text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li 
                    key={itemIdx}
                    className="flex items-start text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <div className="text-gray-400">
            Step {stepNumber} of {totalSteps}
          </div>
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-105 flex items-center"
          >
            <Award className="w-5 h-5 mr-2" />
            Complete Step
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function Checklist() {
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expandedGuides, setExpandedGuides] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [checklistData, setChecklistData] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchChecklistData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/checklist`);        const result = await response.json();
        setChecklistData(result.data);
      } catch (error) {
        console.error('Error fetching checklist data:', error);
      }
    };

    fetchChecklistData();
  }, []);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage = input.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInput(''); // Clear input immediately after sending
      setIsLoading(true);

      try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
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
              <div className="text-sm space-y-1">
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
      <div ref={messagesEndRef} />
    </div>
  );
  
  
    const formatMessage = (content) => {
      console.log(messages);
    return (
      <ReactMarkdown 
        className="prose prose-sm prose-invert max-w-none"
        components={{
          h1: ({node, ...props}) => <h1 className="bg-white text-lg font-bold mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="bg-white text-md font-bold mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="bg-white text-sm font-bold mb-1" {...props} />,
          p: ({node, ...props}) => <p className="bg-white mb-2 text-sm" {...props} />,
          ul: ({node, ...props}) => <ul className="bg-white list-disc pl-4 mb-2" {...props} />,
          ol: ({node, ...props}) => <ol className="bg-white list-decimal pl-4 mb-2" {...props} />,
          li: ({node, ...props}) => <li className="bg-white mb-1" {...props} />,
          code: ({node, ...props}) => <code className="bg-white px-1 rounded" {...props} />,
          strong: ({node, ...props}) => <strong className="bg-white font-bold text-blue-300" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  // Flatten all items into a single array for the path
  const allSteps = checklistData.flatMap(section => 
    section.items.map(item => ({
      ...item,
      sectionTitle: section.title
    }))
  );

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
    setCurrentStep(null);

    // If all steps are completed, show congratulations
    if (newCompleted.size === allSteps.length) {
      setShowCongrats(true);
    } else if (stepIndex < allSteps.length - 1) {
      // Automatically open next step after a short delay
      setTimeout(() => setCurrentStep(stepIndex + 1), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#232f3e] overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#ff9900] mb-4">
            Export Journey Quest
          </h1>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-2xl text-[#f2f2f2]">
              WorldWise brings you a revolutionary approach to international trade documentation
            </p>
            <p className="text-lg text-[#f2f2f2]/80">
              Navigate through our step-by-step process that simplifies one of the most complex aspects 
              of exporting - documentation gathering and compliance.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-[#146eb4]/10 p-6 rounded-xl border border-[#146eb4]/20">
              <h3 className="text-[#ff9900] text-lg font-semibold mb-2">Smart Guidance</h3>
              <p className="text-[#f2f2f2]/80">Step-by-step assistance through every document requirement</p>
            </div>
            <div className="bg-[#146eb4]/10 p-6 rounded-xl border border-[#146eb4]/20">
              <h3 className="text-[#ff9900] text-lg font-semibold mb-2">Compliance Assured</h3>
              <p className="text-[#f2f2f2]/80">Meet international trade standards with confidence</p>
            </div>
            <div className="bg-[#146eb4]/10 p-6 rounded-xl border border-[#146eb4]/20">
              <h3 className="text-[#ff9900] text-lg font-semibold mb-2">Time Efficient</h3>
              <p className="text-[#f2f2f2]/80">Streamlined process saving you valuable time</p>
            </div>
          </div>
        </div>

        {/* Journey Path Container with Fixed Scrollbar */}
        <div className="relative mb-16">
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#ff9900] scrollbar-track-[#146eb4]/20">
            {/* Connecting Line */}
            <div className="absolute top-24 left-0 right-0 h-2 bg-gradient-to-r from-[#146eb4]/20 via-[#ff9900]/20 to-[#146eb4]/20 transform -translate-y-1/2" />

            {/* Steps */}
            <div className="flex min-w-max px-4 relative z-10 py-8">
              {allSteps.map((step, index) => (
                <PathStep
                  key={index}
                  index={index}
                  title={step.name}
                  isCompleted={completedSteps.has(index)}
                  isActive={currentStep === index}
                  onClick={() => setCurrentStep(index)}
                  totalSteps={allSteps.length}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Styling Updates */}
        {currentStep !== null && (
          <StepModal
            step={allSteps[currentStep]}
            onClose={() => setCurrentStep(null)}
            onComplete={() => handleStepComplete(currentStep)}
            stepNumber={currentStep + 1}
            totalSteps={allSteps.length}
          />
        )}

        {/* Updated Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#f2f2f2] rounded-xl p-8 max-w-md mx-4 transform animate-bounce-slow shadow-2xl">
              <div className="text-center">
                <Trophy className="w-20 h-20 mx-auto text-[#ff9900] mb-4" />
                <h2 className="text-3xl font-bold text-[#232f3e] mb-4">
                  Congratulations!
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed all the necessary steps and are now ready for exporting! 
                  Your journey to international trade begins here.
                </p>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="bg-[#ff9900] text-[#232f3e] px-8 py-3 rounded-full font-semibold hover:bg-[#146eb4] hover:text-[#f2f2f2] transition-all duration-200 hover:scale-105"
                >
                  Start Exporting!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="fixed bottom-8 right-8 z-50">
          {showChat ? (
            <div className="bg-[#f2f2f2] rounded-xl shadow-2xl w-[400px]">
              <div className="p-4 border-b border-[#146eb4] flex justify-between items-center bg-[#146eb4] rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2f2f2] flex items-center justify-center">
                    <span className="text-[#146eb4] text-xl font-bold"><img src="/images/ai-bot.png" className="rounded"/></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#f2f2f2]">Export Assistant</h3>
                    <p className="text-sm text-[#f2f2f2]/80">Here to help with your export journey</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-[#f2f2f2] hover:text-[#ff9900] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-[#146eb4] scrollbar-track-gray-100">
                <ChatMessages messages={messages} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleChatSubmit}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#146eb4] focus:border-transparent"
                      placeholder="Ask about export requirements..."
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className={`px-6 py-2 rounded-full text-[#232f3e] transition-colors ${
                        isLoading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-[#ff9900] hover:bg-[#146eb4] hover:text-[#f2f2f2]'
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
              className="transform transition-all duration-300 hover:scale-110"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff9900] flex items-center justify-center shadow-xl hover:bg-[#146eb4] transition-colors">
                <span className="text-[#232f3e] hover:text-[#f2f2f2] text-2xl font-bold"><img src="/images/ai-bot.png" className="rounded"/></span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default Checklist;
