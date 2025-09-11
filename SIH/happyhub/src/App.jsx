import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import EmotionPredictor from "./component/EmotionPredictor";
import CalmNavbar from "./component/CalmNavbar";

import MindRefresh from "./component/home";
import CalmFooter from "./component/pages/footer";


function App() {
  return (
    <>
      <CalmNavbar />
      <MindRefresh/>
      <CalmFooter/>
      <EmotionPredictor />
      {/* other sections */}
    </>
  );
}

export default App;


