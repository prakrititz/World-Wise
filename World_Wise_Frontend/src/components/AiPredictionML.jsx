import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiPredictionML = () => {
  const [country, setCountry] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/risk-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ country: country })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        risk_score: null,
        analysis: "We're experiencing technical difficulties. Please try again in a moment."
      });
    } finally {
      setLoading(false);
    }
};




  const getRiskColor = (score) => {
    if (score <= 3) return 'text-green-500';
    if (score <= 7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskIcon = (score) => {
    if (score <= 3) return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (score <= 7) return <Info className="w-8 h-8 text-yellow-500" />;
    return <AlertTriangle className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Export Risk Analysis
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-400 text-blue-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Analyze Risk
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        )}

        {result && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              {getRiskIcon(result.risk_score)}
              <div>
                <h2 className="text-2xl font-bold text-white">Risk Score</h2>
                <p className={`text-3xl font-bold ${getRiskColor(result.risk_score)}`}>
                  {(result.risk_score * 10).toFixed(1)}%
                </p>
              </div>
            </div>
              <div className="prose prose-invert prose-yellow max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 className="text-3xl font-bold text-yellow-400 mb-6 border-b border-yellow-400/20 pb-3" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 className="text-2xl font-bold text-yellow-400 mt-8 mb-4 flex items-center gap-2" {...props}>
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        {props.children}
                      </h2>
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-300 leading-relaxed mb-4" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="space-y-2 my-4" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="flex items-start gap-2 text-gray-300">
                        <span className="text-yellow-400 mt-1.5">•</span>
                        <span>{props.children}</span>
                      </li>
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-yellow-400 pl-4 my-4 italic text-gray-300" {...props} />
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-blue-900/50 px-2 py-1 rounded text-yellow-400" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-bold text-yellow-400" {...props} />
                    )
                  }}
                >
                  {result.analysis}
                </ReactMarkdown>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AiPredictionML;
