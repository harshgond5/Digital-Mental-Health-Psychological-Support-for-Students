
import './App.css';
import { Routes, Route } from "react-router-dom";

import CalmNavbar from "./component/CalmNavbar";
import CalmFooter from "./component/pages/footer";
import MindRefresh from "./component/home";
import EmotionPredictor from "./component/EmotionPredictor";
import About from "./component/pages/about";
import Contact from "./component/pages/contact";
import LoginPage from "./component/pages/loginpage";
import HomePage from "./component/pages/homepage";
import StressAssessmentPage from "./component/pages/form"; 
import StressReliefAudios from "./component/pages/audio";
import MemorySharingPage from "./component/pages/memory";
import CBTSection from "./component/pages/cbt";
// Use the correct relative path


function App() {
  return (
    <>
      {/* Navbar always visible */}
      <CalmNavbar />

      {/* Route-based content */}
      <Routes>
        <Route path='/' element={<MindRefresh />} />
        <Route path='/About' element={<About/>} />
        <Route path='/Contact' element={<Contact/>} />
         <Route path='/login' element={<LoginPage />} /> 
         <Route path="/home" element={<HomePage />} />
         <Route path="/start" element={<StressAssessmentPage />} />
         <Route path="/audio" element={<StressReliefAudios />} />
         <Route path="/memory" element={<MemorySharingPage />} />
          <Route path="/cbt" element={<CBTSection/>} />

        {/* Add more routes here if needed */}
      </Routes>

      {/* Footer always visible */}
      <CalmFooter />
    </>
  );
}

export default App;
