import React, { useState, useRef, useEffect } from 'react';
import { Trophy, CheckCircle2, Lock, X, ChevronRight, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Checklist Data


// PathStep Component
const PathStep = ({ index, title, isCompleted, isActive, onClick, totalSteps }) => {
  const isLocked = index > 0 && !isCompleted;

  return (
    <div 
      className="flex flex-col items-center px-2"
    >
      <button
        onClick={onClick}
        disabled={isLocked}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          transform transition-all duration-300 mt-5
          ${isActive ? 'scale-110' : 'hover:scale-105'}
          ${isCompleted 
            ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/50' 
            : isLocked
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-purple-500/50'}
        `}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-8 h-8 text-white" />
        ) : isLocked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : (
          <span className="text-xl font-bold text-white">{index + 1}</span>
        )}
      </button>
      <div className="mt-4 text-center">
        <h3 className={`font-semibold mt-5 ${isCompleted ? 'text-green-400' : 'text-white'}`}>
          {title}
        </h3>
      </div>
    </div>
  );
};

// StepModal Component
const StepModal = ({ step, onClose, onComplete, stepNumber, totalSteps }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-blue-400 text-sm mb-1">{step.sectionTitle}</p>
            <h2 className="text-2xl font-bold text-yellow-400">{step.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-300 mb-8">{step.description}</p>

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

// ChatMessages Component
const ChatMessages = ({ messages }) => {
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

  return (
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
};

// Main App Component
function Checklist() {
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const stepsContainerRef = useRef(null);
  const [checklistData, setChecklistData] = useState([]);

useEffect(() => {
  const fetchChecklistData = async () => {
    try {
      const response = await fetch('http://localhost:8000/checklist');
      const result = await response.json();
      setChecklistData(result.data);
    } catch (error) {
      console.error('Error fetching checklist data:', error);
    }
  };

  fetchChecklistData();
}, []);

  // Flatten all items into a single array for the path
  const allSteps = checklistData.flatMap(section => 
    section.items.map(item => ({
      ...item,
      sectionTitle: section.title
    }))
  );

  const scrollToStep = (stepIndex) => {
    if (scrollContainerRef.current && stepsContainerRef.current) {
      const stepElement = stepsContainerRef.current.children[stepIndex];
      if (stepElement) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const stepLeft = stepElement.offsetLeft;
        const stepWidth = stepElement.offsetWidth;
        
        // Calculate the scroll position to center the step
        const scrollPosition = stepLeft - (containerWidth / 2) + (stepWidth / 2);
        
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
    setCurrentStep(null);

    if (newCompleted.size === allSteps.length) {
      setShowCongrats(true);
    } else if (stepIndex < allSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(stepIndex + 1);
        scrollToStep(stepIndex + 1);
      }, 500);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInput('');
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

  useEffect(() => {
    if (currentStep !== null) {
      scrollToStep(currentStep);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-16">
          Export Journey Quest
        </h1>

        <div className="relative py-20">
          <div 
            ref={scrollContainerRef}
            className="relative overflow-x-auto scrollbar-thin"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
            }}
          >
            <div className="inline-flex min-w-max px-4">
              <div 
                className="absolute top-1/2 h-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 transform -translate-y-1/2 rounded-full"
                style={{width: `${allSteps.length * 220}px`}}
              />

              <div 
                ref={stepsContainerRef}
                className="flex space-x-8 relative z-10"
              >
                {allSteps.map((step, index) => (
                  <PathStep
                    key={index}
                    index={index}
                    title={step.name}
                    isCompleted={completedSteps.has(index)}
                    isActive={currentStep === index}
                    onClick={() => {
                      setCurrentStep(index);
                      scrollToStep(index);
                    }}
                    totalSteps={allSteps.length}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {currentStep !== null && (
          <StepModal
            step={allSteps[currentStep]}
            onClose={() => setCurrentStep(null)}
            onComplete={() => handleStepComplete(currentStep)}
            stepNumber={currentStep + 1}
            totalSteps={allSteps.length}
          />
        )}

        {showCongrats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform animate-bounce-slow">
              <div className="text-center">
                <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Congratulations!
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed all the necessary steps and are now ready for exporting! 
                  Your journey to international trade begins here.
                </p>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105"
                >
                  Start Exporting!
                </button>
              </div>
            </div>
          </div>
        )}

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
}

export default Checklist;
