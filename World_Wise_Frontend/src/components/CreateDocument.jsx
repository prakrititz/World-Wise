import React, { useState } from 'react';
import { FileText, Package, Truck, FileCheck, Globe, Shield, X, Download } from 'lucide-react';

const documents = [
    {
      id: 1,
      name: "Export Agreement/Proforma Invoice",
      icon: <FileText className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/exportAgreementPerformaInvoice.png",
      description: "Initial agreement outlining terms, prices, and conditions before final invoice",
      pdfUrl: "/pdfs/export_agreement_proforma_invoice.pdf"
    },
    {
      id: 2,
      name: "Commercial Invoice",
      icon: <Package className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/commercialInvoice.png",
      description: "Official invoice stating the value, quantity, and details of exported goods",
     pdfUrl: "/pdfs/commercial_invoice.pdf"
    },
    {
      id: 3,
      name: "Packing List",
      icon: <Truck className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/packingList.png",
      description: "Detailed list of items, quantities, and packaging details for shipment",
      pdfUrl: "/pdfs/packing_list.pdf"
    },
    {
      id: 4,
      name: "Certificate of Origin",
      icon: <Globe className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/certificateOfOrigin.png",
      description: "Official document certifying where goods were manufactured or produced",
 pdfUrl: "/pdfs/certificate_of_origin.pdf"
    },
    {
      id: 5,
      name: "Letter of Credit",
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/letterOfCredit.png",
      description: "Bank guarantee ensuring payment upon meeting specified conditions",
      pdfUrl: "/pdfs/letter_of_credit.pdf"
    },
    {
      id: 6,
      name: "Bill of Lading",
      icon: <FileCheck className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/billOfLading.png",
      description: "Transport document serving as receipt and title to shipped goods",
      pdfUrl: "/pdfs/bill_of_lading.pdf"
    },
    {
      id: 7,
      name: "Tax Invoice",
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/taxInvoice.png",
      description: "Document showing tax calculations and charges on exported goods",
      pdfUrl: "/pdfs/tax_invoice.pdf"
    },
    {
      id: 8,
      name: "Inland Bill Of Lading",
      icon: <FileCheck className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/InlandBillOfLading.png",
      description: "Transport document for domestic land-based shipment of goods",
      pdfUrl: "/pdfs/inland_bill_of_lading.pdf"
    },
    {
      id: 9,
      name: "Ocean Bill Of Lading",
      icon: <Shield className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/OceanBillOfLading.png",
      description: "Maritime transport document for international sea freight",
      pdfUrl: "/pdfs/ocean_bill_of_lading.pdf"
    },
    {
      id: 10,
      name: "Dock Receipt",
      icon: <FileText className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/DockReceipt.png",
      description: "Proof of delivery of goods to the shipping terminal or dock",
      pdfUrl: "/pdfs/dock_receipt.pdf"
    },
    {
      id: 11,
      name: "Airway Bill",
      icon: <FileCheck className="w-8 h-8 text-yellow-400" />,
      image: "/images/pdfImages/AirwayBill.png",
      description: "Air transport document and receipt for goods shipped by air freight",
      pdfUrl: "/pdfs/air_waybill.pdf"
    }
  ];
  

const ImagePreview = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
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
    console.log(documentName);
    const baseUrl = window.location.origin;
    const fullPath = `${baseUrl}${documentName}`;
    console.log(fullPath);
  
    const link = document.createElement('a');
    link.href = fullPath;
    link.download = `${documentName.toLowerCase().replace(/\s+/g, '_')}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Export Document Templates</h2>
          <p className="text-xl text-yellow-400 max-w-3xl mx-auto">
            Our platform provides comprehensive templates for all essential export documents. Download professionally crafted templates that ensure compliance and streamline your international trade documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  {doc.icon}
                  <img 
                    src={doc.image} 
                    alt={doc.name}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setPreviewImage(doc.image)}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{doc.name}</h3>
                <p className="text-gray-200 mb-6">{doc.description}</p>
                <button
                  onClick={() => handleDownload(doc.pdfUrl)}
                  className="w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-white/20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Template Resources</h4>
              <p className="text-gray-200">
                Access professional export document templates designed to meet international trade standards.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-200">
                <li><a href="#" className="hover:text-yellow-400">Template Guide</a></li>
                <li><a href="#" className="hover:text-yellow-400">Export Regulations</a></li>
                <li><a href="#" className="hover:text-yellow-400">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Support</h4>
              <p className="text-gray-200">
                Need help with our templates?<br />
                Email: support@exportwise.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="text-center text-gray-200 py-4 border-t border-white/20">
            © 2024 Export Documentation Suite. All rights reserved.
          </div>
        </footer>
      </div>

      {previewImage && (
        <ImagePreview 
          image={previewImage} 
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
};

export default CreateDocument;
