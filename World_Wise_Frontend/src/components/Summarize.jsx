import React, { useState, useEffect } from 'react';
import { Upload, FileText, ArrowLeft, Info } from 'lucide-react';
import Chatbot from "./Chatbot";
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Summarize = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/summarize`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setResult(data.response.summary);
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
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-10 h-10 text-[#ff9900]" />
              <h1 className="text-4xl font-bold text-white">Smart Document Summarizer</h1>
            </div>
            <p className="text-lg text-white/80">
              Simplify your export documentation process with AI-powered summaries
            </p>
          </div>

          <div className="bg-[#ff9900]/10 border border-[#ff9900]/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-[#ff9900] mt-1 flex-shrink-0" />
              <div className="space-y-4 text-white/90">
                <p>
                  Export documentation can be overwhelming, with multiple lengthy documents requiring careful review:
                </p>
                <ul className="list-none space-y-2">
                  {[
                    'Complex trade agreements spanning hundreds of pages',
                    'Detailed regulatory compliance documents',
                    'Extensive shipping and customs documentation',
                    'Multiple government scheme guidelines',
                    'International trade policies and procedures'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff9900]"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p>
                  Our AI-powered summarizer helps you extract key information quickly and efficiently.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".txt,.doc,.docx,.pdf"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#ff9900] file:text-[#232f3e] file:font-semibold hover:file:bg-[#ff9900]/90 file:transition-colors cursor-pointer"
              />
              <button
                type="submit"
                disabled={!file || loading}
                className="px-8 py-4 bg-[#ff9900] text-[#232f3e] rounded-xl font-bold hover:bg-[#ff9900]/90 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                Summarize Document
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
              <h2 className="text-2xl font-bold text-[#ff9900] mb-6">Document Summary</h2>
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
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default Summarize;
