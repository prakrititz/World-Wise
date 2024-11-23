import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Loader } from 'lucide-react';

const DetailedGuide = () => {
  const { stepName } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedGuide = async () => {
      try {
        const response = await fetch('http://localhost:8000/detailed-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ step_name: stepName }),
        });
        const data = await response.json();
        setContent(data.response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedGuide();
  }, [stepName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-8 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Steps
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/20 pb-4">
            {stepName}
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            <div className="prose prose-invert prose-yellow max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => (
                    <h2 className="text-2xl font-bold text-yellow-400 mt-8 mb-4 border-b border-yellow-400/20 pb-2" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-gray-200 mb-4 leading-relaxed" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="space-y-2 my-4" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="text-gray-300 flex items-start gap-2" {...props}>
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{props.children}</span>
                    </li>
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-yellow-400 pl-4 my-4 text-gray-300 italic" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-blue-900/50 rounded px-2 py-1 text-yellow-400" {...props} />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedGuide;
