import React, { useState, useEffect } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import IECdata from "./IEC.json";
import RCMCdata from "./RCMC.json";
import Chatbot from "./Chatbot"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DetailedGuide = () => {
  const { stepName } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedGuide = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/detailed-guide`, {
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

  const tutorialStepsIEC = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"];
  const tutorialStepsRCMC = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"];

  return (
    <div className="min-h-screen bg-[#232f3e]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className='flex align-middle'>
          <ArrowLeft className="w-5 h-5 mr-2 text-[#ff9900] hover:text-[#f2f2f2]" />
          <Link to="/checklist" className="text-[#ff9900] hover:text-[#f2f2f2]">
            Back to Overview
          </Link>
        </div>

        <div className="mt-3 bg-[#f2f2f2] p-8 shadow-lg w-screen relative left-[50%] right-[50%] -mx-[50vw]">
          <h1 className="text-5xl font-bold text-[#146eb4] max-w-4xl mx-auto">{stepName}</h1>
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
                    <h2 className="text-2xl font-bold text-orange-600 mt-8 mb-4" {...props} />
                  ),
                  h3: ({node, ...props}) => (
                    <h3 className="text-2xl font-semibold text-orange-400 mt-6 mb-3" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="text-white mb-4 leading-relaxed text-xl" {...props} />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="space-y-2 my-4 list-none pl-0" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="text-white text-lg flex items-start gap-3 pl-0" {...props}>
                      <span className="text-xl inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2.5 flex-shrink-0"></span>
                      <span>{props.children}</span>
                    </li>
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-indigo-200 pl-4 my-6 text-gray-600 italic bg-gray-50 py-3 pr-4 rounded-r" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-[#232f3e] rounded px-2 py-1 text-indigo-600 text-sm font-mono" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="text-indigo-600 hover:text-indigo-700 underline decoration-1 underline-offset-2" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong className="font-semibold text-white text-xl" {...props} />
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
            {stepName=="IEC Code"?<div className="space-y-6">
              {tutorialStepsIEC.map((step, index) => (
                <div 
                  key={index}
                  className="bg-[#f2f2f2] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2">
                      <img
                        src={"/images/IEC/IEC_"+step+".png"}
                        alt={`Step ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-6 flex items-center bg-[#232f3e]">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center">
                          <span className="text-white font-medium">{index + 1}</span>
                        </div>
                        <p className="text-white text-lg leading-relaxed bg-[#232f3e]">
                          {IECdata[step]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>:null}
            {stepName=="RCMC"?<div className="space-y-6">
              {tutorialStepsRCMC.map((step, index) => (
                <div 
                  key={index}
                  className="bg-[#f2f2f2] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2">
                      <img
                        src={"/images/RCMC/RCMC_"+step+".png"}
                        alt={`Step ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="w-full md:w-1/2 p-6 flex items-center bg-[#232f3e]">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center">
                          <span className="text-white font-medium">{index + 1}</span>
                        </div>
                        <p className="text-white text-lg leading-relaxed bg-[#232f3e]">
                          {RCMCdata[step]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>:null}            
          </div>
          )}
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default DetailedGuide;
