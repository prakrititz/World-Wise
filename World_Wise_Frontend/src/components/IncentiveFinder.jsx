import React, { useState } from 'react';
import { Search, HelpCircle, Info, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Chatbot from "./Chatbot";
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const IncentiveFinder = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/incentives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setResult(data.response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#232f3e] to-[#131921] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/checklist" className="flex items-center text-[#ff9900] hover:text-[#f2f2f2] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Overview
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Export Incentives Finder
            </h1>
            <p className="text-lg text-white/80">
              Discover optimal government schemes and incentives for your export business
            </p>
          </div>

          <div className="bg-[#ff9900]/10 border border-[#ff9900]/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-[#ff9900] mt-1 flex-shrink-0" />
              <p className="text-white/90">
                Our AI-powered tool analyzes various government export schemes and matches them with your products and business needs. Get personalized recommendations and answers to your questions about export incentives.
              </p>
            </div>
          </div>

          <div className="mb-8 text-white/80">
            <p className="mb-3 text-lg">You can:</p>
            <ul className="list-none space-y-2">
              {[
                'Search for specific product-related incentives',
                'Ask about eligibility criteria and documentation',
                'Learn about application processes and deadlines',
                'Get clarification on scheme benefits and requirements'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff9900]"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., 'What incentives are available for textile exports?' or 'How do I apply for RODTEP scheme?'"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ff9900] focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-[#ff9900] text-[#232f3e] rounded-xl font-bold hover:bg-[#ff9900]/90 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                Find Incentives
              </button>
            </div>
          </form>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ff9900]"></div>
            </div>
          )}

          {result && (
            <div className="bg-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[#ff9900] mb-6">Results</h2>
              <ReactMarkdown
                className="prose prose-invert max-w-none"
                components={{
                  h2: ({node, ...props}) => (
                    <h2 className="text-2xl font-bold text-[#ff9900] mt-8 mb-4" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-xl font-semibold text-[#ff9900]/80 mt-6 mb-3" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-white/90 mb-4 leading-relaxed text-lg" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="space-y-3 my-4" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="flex items-start gap-3 text-white/80" {...props}>
                      <span className="inline-block w-2 h-2 rounded-full bg-[#ff9900] mt-2 flex-shrink-0"></span>
                      <span>{props.children}</span>
                    </li>
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-bold text-[#ff9900]" {...props} />
                  )
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          )}

          <div className="mt-8 bg-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-[#ff9900]" />
              <h2 className="text-lg font-bold text-[#ff9900]">Need Help?</h2>
            </div>
            <p className="text-white/80">
              Try asking about specific schemes like MEIS, RODTEP, or RoSCTL, or ask about incentives for your industry sector. You can also inquire about documentation requirements, application procedures, or eligibility criteria.
            </p>
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default IncentiveFinder;
