import React, { useState } from 'react';
import { FileText, Package, Truck, FileCheck, Globe, Shield, X, Download, AlertCircle } from 'lucide-react';
import Chatbot from "./Chatbot";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const documents = [
  {
    id: 1,
    name: "Export Agreement/Proforma Invoice",
    icon: <FileText className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/exportAgreementPerformaInvoice.png",
    description: "Initial agreement outlining terms, prices, and conditions before final invoice",
    pdfUrl: "/pdfs/export_agreement_proforma_invoice.pdf",
    required: true
  },
  {
    id: 2,
    name: "Commercial Invoice",
    icon: <Package className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/commercialInvoice.png",
    description: "Official invoice stating the value, quantity, and details of exported goods",
    pdfUrl: "/pdfs/commercial_invoice.pdf",
    required: true
  },
  {
    id: 3,
    name: "Packing List",
    icon: <Truck className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/packingList.png",
    description: "Detailed list of items, quantities, and packaging details for shipment",
    pdfUrl: "/pdfs/packing_list.pdf",
    required: true
  },
  {
    id: 4,
    name: "Certificate of Origin",
    icon: <Globe className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/certificateOfOrigin.png",
    description: "Official document certifying where goods were manufactured or produced",
    pdfUrl: "/pdfs/certificate_of_origin.pdf",
    required: true
  },
  {
    id: 5,
    name: "Letter of Credit",
    icon: <Shield className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/letterOfCredit.png",
    description: "Bank guarantee ensuring payment upon meeting specified conditions",
    pdfUrl: "/pdfs/letter_of_credit.pdf",
    required: true
  },
  {
    id: 6,
    name: "Bill of Lading",
    icon: <FileCheck className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/billOfLading.png",
    description: "Transport document serving as receipt and title to shipped goods",
    pdfUrl: "/pdfs/bill_of_lading.pdf",
    required: true
  },
  {
    id: 7,
    name: "Tax Invoice",
    icon: <Shield className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/taxInvoice.png",
    description: "Document showing tax calculations and charges on exported goods",
    pdfUrl: "/pdfs/tax_invoice.pdf",
    required: false
  },
  {
    id: 8,
    name: "Inland Bill Of Lading",
    icon: <FileCheck className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/InlandBillOfLading.png",
    description: "Transport document for domestic land-based shipment of goods",
    pdfUrl: "/pdfs/inland_bill_of_lading.pdf",
    required: false
  },
  {
    id: 9,
    name: "Ocean Bill Of Lading",
    icon: <Shield className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/OceanBillOfLading.png",
    description: "Maritime transport document for international sea freight",
    pdfUrl: "/pdfs/ocean_bill_of_lading.pdf",
    required: false
  },
  {
    id: 10,
    name: "Dock Receipt",
    icon: <FileText className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/DockReceipt.png",
    description: "Proof of delivery of goods to the shipping terminal or dock",
    pdfUrl: "/pdfs/dock_receipt.pdf",
    required: false
  },
  {
    id: 11,
    name: "Airway Bill",
    icon: <FileCheck className="w-6 h-6 text-indigo-500" />,
    image: "/images/pdfImages/AirwayBill.png",
    description: "Air transport document and receipt for goods shipped by air freight",
    pdfUrl: "/pdfs/air_waybill.pdf",
    required: false
  }
];

const ImagePreview = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={image} 
          alt="Document Preview" 
          className="w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

const CreateDocument = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const handleDownload = (documentName) => {
    const baseUrl = window.location.origin;
    const fullPath = `${baseUrl}${documentName}`;
    
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = `${documentName.toLowerCase().replace(/\s+/g, '_')}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#232f3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#f2f2f2] mb-6">
            Export Documentation Hub
          </h1>
          <p className="text-xl text-[#f2f2f2] max-w-3xl mx-auto leading-relaxed mb-8">
            Access all essential export documents in one place. Our comprehensive template collection 
            covers everything you need for successful international trade operations.
          </p>
          
          <div className="bg-[#2a384a] p-6 rounded-xl max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-[#ff9900] flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-[#ff9900] font-semibold mb-2">Important Note About Export Documentation</h3>
                <p className="text-gray-300 text-sm">
                  International trade typically requires 6-11 key documents depending on the destination 
                  country and type of goods. Download our pre-formatted templates below to ensure 
                  compliance with international trade regulations. Documents marked with (*) are usually 
                  mandatory for most exports.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="bg-[#f2f2f2] rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    {doc.icon}
                  </div>
                  <img 
                    src={doc.image} 
                    alt={doc.name}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                    onClick={() => setPreviewImage(doc.image)}
                  />
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{doc.name}</h3>
                  {doc.required && (
                    <span className="text-red-500 text-sm">*</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">{doc.description}</p>
                <button
                  onClick={() => handleDownload(doc.pdfUrl)}
                  className="w-full bg-[#146eb4] text-[#f2f2f2] py-3 px-4 rounded-lg font-medium hover:bg-[#ff9900] hover:text-[#000000] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-5 h-5" />
                  Download Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#2a384a] rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#f2f2f2] mb-6">Need Help With Export Documentation?</h2>
          <p className="text-gray-300 mb-6">
            Our export documentation specialists are here to help you navigate the requirements for your specific 
            trade route and goods. Get expert guidance on document preparation and compliance.
          </p>
          <button className="bg-[#ff9900] text-[#232f3e] px-6 py-3 rounded-lg font-medium hover:bg-[#ff9900]/90 transition-colors">
            Contact Our Export Specialists
          </button>
        </div>

        <footer className="mt-24 border-t border-gray-700 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-lg font-semibold text-[#f2f2f2] mb-4">Resources</h4>
              <p className="text-gray-400 leading-relaxed">
                Access professional export document templates designed to meet international trade standards and regulations.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#f2f2f2] mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-[#ff9900] transition-colors">Template Guide</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ff9900] transition-colors">Export Regulations</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ff9900] transition-colors">Support Center</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#f2f2f2] mb-4">Contact</h4>
              <p className="text-gray-400 leading-relaxed">
                Need assistance with our templates?<br />
                Email: support@exportwise.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="text-center text-gray-400 py-8 mt-12 border-t border-gray-700">
            © {new Date().getFullYear()} Export Documentation Suite. All rights reserved.
          </div>
        </footer>
      </div>

      {previewImage && (
        <ImagePreview 
          image={previewImage} 
          onClose={() => setPreviewImage(null)}
        />
      )}
      <Chatbot/>
    </div>
  );
};

export default CreateDocument;
