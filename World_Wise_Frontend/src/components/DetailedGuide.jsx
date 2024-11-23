import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-8 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Overview
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 bg-white px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {stepName}
            </h1>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    h2: ({node, ...props}) => (
                      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3" {...props} />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-600 mb-4 leading-relaxed text-base" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="space-y-2 my-4 list-none pl-0" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-gray-600 flex items-start gap-3 pl-0" {...props}>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2.5 flex-shrink-0"></span>
                        <span>{props.children}</span>
                      </li>
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-indigo-200 pl-4 my-6 text-gray-600 italic bg-gray-50 py-3 pr-4 rounded-r" {...props} />
                    ),
                    code: ({node, ...props}) => (
                      <code className="bg-gray-100 rounded px-2 py-1 text-indigo-600 text-sm font-mono" {...props} />
                    ),
                    a: ({node, ...props}) => (
                      <a className="text-indigo-600 hover:text-indigo-700 underline decoration-1 underline-offset-2" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-semibold text-gray-900" {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full divide-y divide-gray-200" {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => (
                      <th className="px-4 py-3 bg-gray-50 text-left text-sm font-semibold text-gray-900" {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100" {...props} />
                    ),
                    hr: ({node, ...props}) => (
                      <hr className="my-8 border-gray-200" {...props} />
                    ),
                    img: ({node, ...props}) => (
                      <img className="rounded-lg shadow-sm border border-gray-200" {...props} />
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
    </div>
  );
};

export default DetailedGuide;