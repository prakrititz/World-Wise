import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Info, Globe, TrendingUp, Shield } from 'lucide-react';
import Chatbot from "./Chatbot";
import ReactMarkdown from 'react-markdown';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ff9900]"></div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#2a384a] p-6 rounded-lg">
    <Icon className="w-8 h-8 text-[#ff9900] mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
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
      const response = await fetch(`${BACKEND_URL}/risk-analysis`, {        method: 'POST',
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
    <div className="min-h-screen bg-[#232f3e]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#ff9900] mb-4">
            Export Risk Analysis
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Make informed decisions about your international trade ventures with our advanced AI-powered risk assessment tool.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-[#2a384a] rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Analyze Export Risk</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country name (e.g., Germany, Japan, Brazil)..."
                className="flex-1 px-6 py-4 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e] placeholder-[#232f3e]/60 focus:outline-none focus:ring-2 focus:ring-[#ff9900] text-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-[#ff9900] text-[#232f3e] rounded-lg font-semibold hover:bg-[#146eb4] hover:text-[#f2f2f2] transition-colors flex items-center gap-2 text-lg"
              >
                <Search className="w-6 h-6" />
                {loading ? 'Analyzing...' : 'Analyze Risk'}
              </button>
            </div>
          </form>
          <p className="text-gray-400 text-sm">
            Enter a country name to receive a comprehensive risk analysis for export operations.
          </p>
        </div>

        {/* Features Section */}
        {!result && !loading && (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard 
              icon={Globe}
              title="Global Coverage"
              description="Access risk assessments for over 190 countries with detailed insights into market conditions and trade regulations."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Real-time Analysis"
              description="Get up-to-date risk evaluations using the latest economic indicators and market data."
            />
            <FeatureCard 
              icon={Shield}
              title="Comprehensive Assessment"
              description="Evaluate political stability, economic factors, trade barriers, and regulatory compliance risks."
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <Spinner />
          </div>
        )}

        {!loading && result && (
          <div className="bg-[#f2f2f2] rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-6 mb-8 border-b border-gray-200 pb-6">
              {getRiskIcon(result.risk_score)}
              <div>
                <h2 className="text-3xl font-bold text-[#232f3e]">Risk Assessment for {country}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg text-gray-600">Risk Score:</span>
                  <span className={`text-2xl font-bold ${getRiskColor(result.risk_score)}`}>
                    {(result.risk_score * 10).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <ReactMarkdown
                components={{
                  h1: props => <h1 className="text-[#146eb4] text-2xl font-bold mb-4" {...props} />,
                  h2: props => <h2 className="text-[#232f3e] text-xl font-bold mt-6 mb-3" {...props} />,
                  p: props => <p className="text-[#232f3e]/80 mb-4 leading-relaxed" {...props} />,
                  ul: props => <ul className="list-disc pl-5 mb-4 text-[#232f3e]/80 space-y-2" {...props} />,
                  li: props => <li className="mb-2" {...props} />
                }}
              >
                {result.analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      <Chatbot/>
    </div>
  );
};

export default AiPredictionML;
