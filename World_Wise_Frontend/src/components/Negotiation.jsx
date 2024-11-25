import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import Chatbot from "./Chatbot";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Negotiation = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    currentOffer: '',
    targetPrice: '',
    role: 'buyer',
    context: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/negotiation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data.suggestion);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#232f3e] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ff9900] mb-8 text-center">
          Negotiation Strategy Advisor
        </h1>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.currentOffer}
              onChange={(e) => setFormData({...formData, currentOffer: e.target.value})}
              placeholder="Current Offer Amount ($)"
              className="px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e]"
            />
            <input
              type="number"
              value={formData.targetPrice}
              onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
              placeholder="Target Price/Budget ($)"
              className="px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e]"
            />
          </div>

          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e]"
          >
            <option value="buyer">I am a Buyer</option>
            <option value="seller">I am a Seller</option>
          </select>

          <textarea
            value={formData.context}
            onChange={(e) => setFormData({...formData, context: e.target.value})}
            placeholder="Describe the negotiation context..."
            className="w-full px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e] h-32"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#ff9900] text-[#232f3e] rounded-lg font-semibold hover:bg-[#146eb4] hover:text-[#f2f2f2] transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Get Negotiation Strategy
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff9900]"></div>
          </div>
        )}

        {result && (
          <div className="bg-[#f2f2f2] rounded-2xl p-8 mt-6">
            <div className="prose max-w-none">
              <h2 className="text-[#146eb4] text-2xl font-bold mb-6 border-b pb-4">Suggested Strategy</h2>
              <p className="text-[#232f3e] text-lg leading-relaxed whitespace-pre-line">
                {result}
              </p>
            </div>
          </div>
        )}
      </div>
      <Chatbot/>
    </div>
  );
};

export default Negotiation;
