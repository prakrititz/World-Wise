import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Features from "./Features";
import StepGuide from "./StepGuide";
import Footer from "./Footer";
import Checklist from "./Checklist";
import CreateDocument from "./CreateDocument";
import DetailedGuide from "./DetailedGuide";
import AiPredictionML from "./AiPredictionML";
import "./App.css"
import IncentiveFinder from "./IncentiveFinder";
import Summarize from "./Summarize";
import Negotiation from './Negotiation';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<><HeroSection /><Features /></>} />
          <Route path="/guide" element={<StepGuide />} />
         { /*<Route path="/ai-companion" element={<ExportBuddy />} />*/}
          <Route path="/checklist" element={<Checklist/>} />
          <Route path="/create-document" element={<CreateDocument/>} />
          <Route path="/detailed-guide/:stepName" element={<DetailedGuide />} />
          <Route path="/risk-analysis" element={<AiPredictionML />} />
          <Route path="/get-incentives" element={<IncentiveFinder />} />
          <Route path="/summarize" element={<Summarize />} />
          <Route path="/negotiation" element={<Negotiation />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
