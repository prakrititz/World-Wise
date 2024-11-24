import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const IncentiveFinder = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/incentives', {
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
    <div className="min-h-screen bg-[#232f3e] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ff9900] mb-8 text-center">
          Export Incentives Finder
        </h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for export incentives..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#f2f2f2] border border-[#146eb4] text-[#232f3e] placeholder-[#232f3e]/60 focus:outline-none focus:ring-2 focus:ring-[#ff9900]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#ff9900] text-[#232f3e] rounded-lg font-semibold hover:bg-[#146eb4] hover:text-[#f2f2f2] transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Find Incentives
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff9900]"></div>
          </div>
        )}

        {result && (
          <div className="bg-[#f2f2f2] rounded-2xl p-8">
            <ReactMarkdown
              className="prose max-w-none"
              components={{
                h1: props => <h1 className="text-[#146eb4] text-2xl font-bold mb-4" {...props} />,
                h2: props => <h2 className="text-[#232f3e] text-xl font-bold mt-6 mb-3" {...props} />,
                p: props => <p className="text-[#232f3e]/80 mb-4" {...props} />,
                ul: props => <ul className="list-disc pl-5 mb-4 text-[#232f3e]/80" {...props} />,
                li: props => <li className="mb-2" {...props} />,
                strong: props => <strong className="text-[#146eb4] font-bold" {...props} />
              }}
            >
              {result}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncentiveFinder;
