import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ff9900]"></div>
  </div>
);

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
    <div className="min-h-screen bg-[#232f3e] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ff9900] mb-8 text-center">
          Export Risk Analysis
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e] placeholder-[#232f3e]/60 focus:outline-none focus:ring-2 focus:ring-[#ff9900]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#ff9900] text-[#232f3e] rounded-lg font-semibold hover:bg-[#146eb4] hover:text-[#f2f2f2] transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Analyzing...' : 'Analyze Risk'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <Spinner />
          </div>
        )}

        {!loading && result && (
          <div className="bg-[#f2f2f2] rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              {getRiskIcon(result.risk_score)}
              <div>
                <h2 className="text-2xl font-bold text-[#232f3e]">Risk Score</h2>
                <p className={`text-3xl font-bold ${getRiskColor(result.risk_score)}`}>
                  {(result.risk_score * 10).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="prose max-w-none">
              <ReactMarkdown
                components={{
                  h1: props => <h1 className="text-[#146eb4] text-2xl font-bold mb-4" {...props} />,
                  h2: props => <h2 className="text-[#232f3e] text-xl font-bold mt-6 mb-3" {...props} />,
                  p: props => <p className="text-[#232f3e]/80 mb-4" {...props} />,
                  ul: props => <ul className="list-disc pl-5 mb-4 text-[#232f3e]/80" {...props} />,
                  li: props => <li className="mb-2" {...props} />
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
