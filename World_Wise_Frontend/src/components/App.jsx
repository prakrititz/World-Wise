import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Features from "./Features";
import StepGuide from "./StepGuide";
import ExportBuddy from "./ExportBuddy";
import Checklist from "./Checklist";
import Footer from "./Footer";
import "./App.css"

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<><HeroSection /><Features /></>} />
          <Route path="/guide" element={<StepGuide />} />
          <Route path="/ai-companion" element={<ExportBuddy />} />
          <Route path="/checklist" element={<Checklist />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
