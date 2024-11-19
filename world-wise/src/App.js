import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import StepGuide from "./components/StepGuide";
import ExportBuddy from "./components/ExportBuddy";
import Checklist from "./components/Checklist";
import Footer from "./components/Footer";

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
