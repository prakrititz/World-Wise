import React, { useState } from 'react';
import { Trophy, CheckCircle2, Lock, X, ChevronRight, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// Checklist Data
const checklistData = [
    {
      id: 1,
      title: "Essential Documentation",
      items: [
        {
          name: "PAN Card",
          description: "Permanent Account Number for tax identification and required for business registration and export activities",
          guide: [
            {
              title: "Decide the Type of PAN",
              items: [
                "For Individuals: Personal PAN",
                "For Businesses: PAN for Proprietorship, Partnership, LLP, Company, Trust, etc."
              ]
            },
            {
              title: "Gather Required Documents",
              items: [
                "Identity Proof: Aadhaar card, voter ID, passport, or driving license",
                "Address Proof: Aadhaar, utility bill, or passport",
                "Date of Birth Proof: Birth certificate, school leaving certificate, or Aadhaar",
                "Photograph: Passport-size"
              ]
            },
            {
              title: "Apply Online",
              items: [
                "Visit NSDL e-Gov or UTIITSL portal",
                "Fill Form 49A/49AA",
                "Upload documents",
                "Pay fee (₹110 for Indian address)",
                "Complete e-KYC",
                "Track status with acknowledgment number"
              ]
            }
          ]
        },
        {
          name: "Bank Account Number",
          description: "Needed for financial transactions and linking to IEC and AD Code",
          guide: [
            {
              title: "Opening a Bank Account",
              items: [
                "Choose a bank offering export-import account services",
                "Gather documents: PAN, Aadhaar, proof of business registration, and address proof",
                "Fill account opening form",
                "Submit Know Your Customer (KYC) documents",
                "Link account to GST and IEC codes"
              ]
            },
            {
              title: "Maintaining Account",
              items: [
                "Keep records of transactions for audits",
                "Monitor account for IEC-related activities",
                "Ensure sufficient balance for application fees and trade activities"
              ]
            }
          ]
        },
        {
          name: "Aadhaar Card/Business Registration Certificate",
          description: "For verifying business identity during registration",
          guide: [
            {
              title: "Using Aadhaar for Verification",
              items: [
                "Ensure Aadhaar is updated with correct details",
                "Link Aadhaar to PAN and bank account",
                "Use Aadhaar OTP for e-KYC during applications"
              ]
            },
            {
              title: "Using Business Registration Certificate",
              items: [
                "Obtain certificate from respective authorities based on business type (e.g., MSME, Shops and Establishments Act)",
                "Ensure details match other submitted documents",
                "Provide digital and physical copies where required"
              ]
            }
          ]
        },
        {
          name: "HS Code",
          description: "Used to classify goods for export and calculate duties",
          guide: [
            {
              title: "Finding the HS Code",
              items: [
                "Visit DGFT or CBIC HS Code lookup websites",
                "Identify code based on product type",
                "Consult with trade experts if needed"
              ]
            },
            {
              title: "Using HS Code",
              items: [
                "Include in Shipping Bill and Invoice",
                "Verify accuracy to avoid penalties or delays"
              ]
            }
          ]
        },
        {
          name: "IEC Code",
          description: "Import Export Code from DGFT, mandatory for all export activities",
          guide: [
            {
              title: "Prerequisites",
              items: [
                "Valid PAN Card",
                "Active Bank Account",
                "Digital Signature Certificate (recommended)"
              ]
            },
            {
              title: "Online Application",
              items: [
                "Visit DGFT website",
                "Register as new user",
                "Fill online IEC application form",
                "Upload required documents",
                "Pay application fee"
              ]
            },
            {
              title: "Post-Approval Steps",
              items: [
                "Download IEC certificate",
                "Link IEC with AD Code in the bank",
                "Maintain IEC for audits and renewals"
              ]
            }
          ]
        },
        {
          name: "GST Registration Certificate",
          description: "Needed for claiming GST refunds on exports",
          guide: [
            {
              title: "Required Documents",
              items: [
                "PAN of Business",
                "Aadhaar of Proprietor/Partners/Directors",
                "Bank Account Details",
                "Business Registration Documents"
              ]
            },
            {
              title: "Steps to Register",
              items: [
                "Visit GST portal",
                "Fill registration form GST REG-01",
                "Upload scanned documents",
                "Submit e-signature",
                "Track application status and download GSTIN"
              ]
            }
          ]
        },
        {
          name: "RCMC",
          description: "Registration-Cum-Membership Certificate required for export benefits under government schemes",
          guide: [
            {
              title: "Obtaining RCMC",
              items: [
                "Apply to Export Promotion Council relevant to your product",
                "Submit proof of business registration, PAN, and IEC",
                "Pay membership fees",
                "Receive RCMC certificate"
              ]
            },
            {
              title: "Using RCMC",
              items: [
                "Access export incentives under MEIS, SEIS, or similar schemes",
                "Provide RCMC details in customs filings"
              ]
            }
          ]
        },
        {
          name: "AD Code",
          description: "Assigned by the bank and linked to IEC; required for customs clearance",
          guide: [
            {
              title: "Steps to Obtain AD Code",
              items: [
                "Request AD Code from your bank",
                "Provide IEC, bank account details, and business registration proof",
                "Bank issues AD Code letter"
              ]
            },
            {
              title: "Linking AD Code",
              items: [
                "Submit AD Code to customs at the port of export",
                "Ensure AD Code is activated for your port"
              ]
            }
          ]
        },
        {
            name: "Export Agreement/Proforma Invoice",
            description: "Defines the terms of trade and initial agreement between exporter and importer",
            guide: [
              {
                title: "Components of an Export Agreement",
                items: [
                  "Details of exporter and importer",
                  "Product description, quantity, and quality",
                  "Delivery terms (e.g., FOB, CIF, EXW)",
                  "Payment terms (e.g., advance, letter of credit)",
                  "Applicable laws and dispute resolution clauses"
                ]
              },
              {
                title: "Preparing a Proforma Invoice",
                items: [
                  "Include exporter and importer details",
                  "Provide product details: description, HS Code, unit price, and total value",
                  "Mention payment terms and delivery timeline",
                  "Add reference to applicable taxes/duties if relevant",
                  "Include exporter’s signature and date"
                ]
              }
            ]
          },
          {
            name: "Letter of Credit or Payment Terms Agreement",
            description: "Secures payment terms for the export",
            guide: [
              {
                title: "Steps to Obtain a Letter of Credit",
                items: [
                  "Agree on LC terms with the importer",
                  "Importer applies for LC at their bank",
                  "Bank issues LC and sends it to exporter’s bank",
                  "Ensure LC terms match the sales agreement"
                ]
              },
              {
                title: "Common Payment Terms",
                items: [
                  "Advance Payment",
                  "Open Account (payment after delivery)",
                  "Cash Against Documents (CAD)",
                  "Letter of Credit (most secure)"
                ]
              }
            ]
          },
          {
            name: "Commercial Invoice",
            description: "Prepared by the exporter; details the goods being exported",
            guide: [
              {
                title: "Key Elements of a Commercial Invoice",
                items: [
                  "Exporter and importer details",
                  "Invoice number and date",
                  "Product details: name, quantity, unit price, and total value",
                  "HS Code for each product",
                  "Payment and delivery terms",
                  "Shipping details: mode, carrier, and destination"
                ]
              },
              {
                title: "Tips for Preparing",
                items: [
                  "Ensure details match the Proforma Invoice",
                  "Check for compliance with import country’s regulations",
                  "Include reference to any trade agreements for duty benefits"
                ]
              }
            ]
          },
          {
            name: "Packing List",
            description: "Lists the details of packaging, supplementing the Commercial Invoice",
            guide: [
              {
                title: "Components of a Packing List",
                items: [
                  "Exporter and importer details",
                  "Invoice number linked to the Packing List",
                  "Description of goods, including quantity and packaging details",
                  "Gross and net weight of each package",
                  "Dimensions of packages"
                ]
              },
              {
                title: "Best Practices",
                items: [
                  "Use standardized packaging materials for ease of handling",
                  "Ensure proper labeling for fragile or perishable items",
                  "Attach the Packing List to the outside of the shipment"
                ]
              }
            ]
          },
          {
            name: "Certificate of Inspection/Quality Certificate",
            description: "Needed for certain goods to meet importer or country-specific standards",
            guide: [
              {
                title: "Steps to Obtain",
                items: [
                  "Identify if your product requires inspection (e.g., machinery, chemicals)",
                  "Contact approved inspection agencies (e.g., BIS, SGS)",
                  "Schedule an inspection of goods",
                  "Receive certificate after successful inspection"
                ]
              },
              {
                title: "Using the Certificate",
                items: [
                  "Attach it to customs documents for clearance",
                  "Share with importer to meet trade requirements"
                ]
              }
            ]
          },
          {
            name: "Phytosanitary and Fumigation Certificate",
            description: "Mandatory for agricultural products or plant-based goods",
            guide: [
              {
                title: "Steps to Obtain Phytosanitary Certificate",
                items: [
                  "Submit application to the nearest Plant Quarantine office",
                  "Provide details of shipment and exporter",
                  "Get goods inspected by quarantine officers",
                  "Receive certificate if goods meet standards"
                ]
              },
              {
                title: "Steps to Obtain Fumigation Certificate",
                items: [
                  "Contact approved fumigation service providers",
                  "Arrange fumigation for goods as per standards",
                  "Receive certificate confirming compliance"
                ]
              }
            ]
          },
          {
            name: "Certificate of Origin",
            description: "May be needed for preferential duty benefits under trade agreements; depends on the Commercial Invoice",
            guide: [
              {
                title: "Types of Certificates of Origin",
                items: [
                  "Preferential: For reduced duties under trade agreements",
                  "Non-Preferential: Certifies origin but doesn’t provide duty benefits"
                ]
              },
              {
                title: "Steps to Obtain",
                items: [
                  "Apply to authorized agency (e.g., chambers of commerce)",
                  "Submit Commercial Invoice, Packing List, and HS Codes",
                  "Receive stamped Certificate of Origin"
                ]
              }
            ]
          },
          {
            name: "Marine Insurance Policy/Insurance Certificate",
            description: "Ensures protection of goods during transit",
            guide: [
              {
                title: "Steps to Obtain Marine Insurance",
                items: [
                  "Select insurance provider specializing in exports",
                  "Provide shipment details: route, mode, and goods value",
                  "Choose type of coverage (e.g., All Risk, Total Loss)",
                  "Pay premium and receive policy"
                ]
              },
              {
                title: "Using Insurance Certificate",
                items: [
                  "Submit to customs if required",
                  "Present to importer for assurance of goods’ safety"
                ]
              }
            ]
          },
          {
            name: "Shipping Bill",
            description: "Core document for customs clearance; depends on the Commercial Invoice, Packing List, and Certificate of Origin",
            guide: [
              {
                title: "Preparing the Shipping Bill",
                items: [
                  "Submit Commercial Invoice, Packing List, and IEC",
                  "Provide HS Code and AD Code details",
                  "Include export duty (if applicable)"
                ]
              },
              {
                title: "Submission",
                items: [
                  "File online through ICEGATE portal",
                  "Receive Shipping Bill number for tracking"
                ]
              }
            ]
          },
          {
            name: "Bill of Lading (or Airway Bill)",
            description: "Issued by the carrier and confirms the goods' shipment; depends on the Shipping Bill",
            guide: [
              {
                title: "Details Included",
                items: [
                  "Exporter and importer details",
                  "Carrier name and mode of transport",
                  "Description of goods, including weight and quantity",
                  "Destination and port of loading"
                ]
              },
              {
                title: "Obtaining the Bill",
                items: [
                  "Submit Shipping Bill and proof of customs clearance to carrier",
                  "Receive original and duplicate copies for use"
                ]
              }
            ]
          },
          {
            name: "Let Export Order",
            description: "Customs-issued clearance for the export after verifying Shipping Bill and related documents",
            guide: [
              {
                title: "Steps to Obtain",
                items: [
                  "Submit Shipping Bill to customs",
                  "Undergo customs inspection (if required)",
                  "Receive Let Export Order once documents are verified"
                ]
              }
            ]
          }
        ]
      }
    ];
  
// PathStep Component
const PathStep = ({ index, title, isCompleted, isActive, onClick, totalSteps }) => {
  const isLocked = index > 0 && !isCompleted;
  return (
    <div
      className="flex flex-col items-center px-2"
      style={{ width: `${100/totalSteps}%` }}
    >
      <button
        onClick={onClick}
        disabled={isLocked}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center
          transform transition-all duration-300
          ${isActive ? 'scale-110' : 'hover:scale-105'}
          ${isCompleted 
            ? 'bg-green-500 shadow-lg shadow-green-400/50'
            : isLocked
              ? 'bg-yellow-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg shadow-blue-500/50'}
        `}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-8 h-8 text-blue-900" />
        ) : isLocked ? (
          <Lock className="w-6 h-6" />
        ) : (
          <span className="text-xl font-bold text-white">{index + 1}</span>
        )}
      </button>
      <div className="mt-4 text-center">
        <h3 className={`font-semibold ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
          {title}
        </h3>
      </div>
    </div>
  );
  
};

// StepModal Component
const StepModal = ({ step, onClose, onComplete, stepNumber, totalSteps }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-blue-400 text-sm mb-1">{step.sectionTitle}</p>
            <h2 className="text-2xl font-bold text-white">{step.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className="text-gray-300 mb-8">{step.description}</p>

          {step.guide?.map((section, idx) => (
            <div 
              key={idx}
              className="mb-8 bg-white/5 rounded-xl p-6 transform transition-all duration-300 hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center mr-3 text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li 
                    key={itemIdx}
                    className="flex items-start text-gray-300 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <div className="text-gray-400">
            Step {stepNumber} of {totalSteps}
          </div>
          <button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-105 flex items-center"
          >
            <Award className="w-5 h-5 mr-2" />
            Complete Step
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expandedGuides, setExpandedGuides] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      // Add user message
      const userMessage = input.trim();
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
      setInput(''); // Clear input immediately after sending
      setIsLoading(true);

      try {
        const response = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Add bot response
        setMessages(prev => [...prev, {
          type: 'bot',
          content: data.response
        }]);
      } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "Sorry, I'm having trouble connecting right now. Please make sure the backend server is running on port 8000."
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const ChatMessages = ({ messages }) => (
    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`mb-6 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.type === 'bot' && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-600 text-sm">A</span>
            </div>
          )}
          <div 
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            {msg.type === 'user' ? (
              <div className="text-sm">{msg.content}</div>
            ) : (
              <div className="text-sm space-y-1">
                {formatMessage(msg.content)}
              </div>
            )}
          </div>
          {msg.type === 'user' && (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2">
              <span className="text-white text-sm">U</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  
  
    const formatMessage = (content) => {
    return (
      <ReactMarkdown 
        className="prose prose-sm prose-invert max-w-none"
        components={{
          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1" {...props} />,
          p: ({node, ...props}) => <p className="mb-2 text-sm" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          code: ({node, ...props}) => <code className="bg-gray-800 px-1 rounded" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  // Flatten all items into a single array for the path
  const allSteps = checklistData.flatMap(section => 
    section.items.map(item => ({
      ...item,
      sectionTitle: section.title
    }))
  );

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);
    setCurrentStep(null);

    // If all steps are completed, show congratulations
    if (newCompleted.size === allSteps.length) {
      setShowCongrats(true);
    } else if (stepIndex < allSteps.length - 1) {
      // Automatically open next step after a short delay
      setTimeout(() => setCurrentStep(stepIndex + 1), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-16">
          Export Journey Quest
        </h1>
          {/* Path Container */}
          <div className="relative py-20 overflow-x-auto">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 transform -translate-y-1/2 rounded-full" />

            {/* Steps */}
            <div className="flex min-w-max px-4 relative z-10 gap-4">
              {allSteps.map((step, index) => (
                <PathStep
                  key={index}
                  index={index}
                  title={step.name}
                  isCompleted={completedSteps.has(index)}
                  isActive={currentStep === index}
                  onClick={() => setCurrentStep(index)}
                  totalSteps={allSteps.length}
                />
              ))}
            </div>
          </div>
        {/* Step Modal */}
        {currentStep !== null && (
          <StepModal
            step={allSteps[currentStep]}
            onClose={() => setCurrentStep(null)}
            onComplete={() => handleStepComplete(currentStep)}
            stepNumber={currentStep + 1}
            totalSteps={allSteps.length}
          />
        )}

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 transform animate-bounce-slow">
              <div className="text-center">
                <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Congratulations!
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed all the necessary steps and are now ready for exporting! 
                  Your journey to international trade begins here.
                </p>
                <button
                  onClick={() => setShowCongrats(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105"
                >
                  Start Exporting!
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="fixed bottom-8 right-8 z-50">
        {showChat ? (
          <div className="bg-white rounded-2xl shadow-2xl w-[400px]">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">A</span>
                </div>
                <div>
                  <h3 className="font-bold">Ani</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <ChatMessages messages={messages} />
            
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleChatSubmit}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask about export requirements..."
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-full text-white transition-colors duration-200 ${
                      isLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChat(true)}
            className="transform transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-xl hover:bg-blue-200">
              <span className="text-blue-600 text-2xl">A</span>
            </div>
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

export default App;