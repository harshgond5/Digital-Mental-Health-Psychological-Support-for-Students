  import './App.css';
  import { Routes, Route } from "react-router-dom";
  import { useState } from 'react'; // For chatbot toggle

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
  import WelcomePage from "./component/pages/welcomepage";
  import BookingPage from "./component/pages/booking";
  import AdminAvailabilityForm from "./component/pages/admin";
  import AdminLoginWithSignup from "./component/pages/adminlogin";
  import AdminAvailability from "./component/pages/adminavaibility";
  import ChatbotComponent from "./component/Chatbot";
  import "./component/Chatbot.css";

  function App() {
    const [showChatbot, setShowChatbot] = useState(false);

    return (
      <>
        <CalmNavbar />

        <Routes>
          <Route path='/' element={<MindRefresh />} />
          <Route path='/About' element={<About/>} />
          <Route path='/Contact' element={<Contact/>} />
           <Route path='/login' element={<LoginPage />} /> 
           <Route path="/home" element={<HomePage />} />
           <Route path="/start" element={<StressAssessmentPage />} />
           <Route path="/form" element={<StressAssessmentPage />} />
           <Route path="/audio" element={<StressReliefAudios />} />
           <Route path="/memory" element={<MemorySharingPage />} />
            <Route path="/cbt" element={<CBTSection/>} />
            <Route path="/welcome" element={<WelcomePage/>} />
            <Route path="/booking" element={<BookingPage/>} />
            <Route path="/adminlogin" element={<AdminLoginWithSignup/>} />
             
             <Route path="/admin" element={<AdminAvailability />} />
        </Routes>

        {/* Floating Toggle Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '24px',
            zIndex: 1001,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: showChatbot ? 'none' : 'block',
          }}
          aria-label="Open Chatbot"
        >
          💬
        </button>

        {/* Chatbot */}
        {showChatbot && (
          <ChatbotComponent onClose={() => setShowChatbot(false)} />
        )}

        <CalmFooter />
      </>
    );
  }

  export default App;
  