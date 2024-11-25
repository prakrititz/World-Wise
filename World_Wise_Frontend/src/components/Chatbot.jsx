import React, { useState, useEffect,useRef } from 'react';
import { Trophy, CheckCircle2, Lock, X, ChevronRight, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

function ChatBot(){
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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


return(
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
        </div>);
}

export default ChatBot;
