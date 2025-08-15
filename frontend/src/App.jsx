import viteLogo from '/vite.svg'
import './App.css'
import Home from './assets/home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
// import BackGround from './assets/partials/background';
import About from './assets/about.jsx';
import SignUp from './assets/SignUp.jsx';
import Login from './assets/login.jsx';

function App() {
const [isSignedUp, setIsSignedUp] = useState(false);
  return (
    <>
    {/* <BackGround/> */}
     <BrowserRouter>
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp setIsSignedUp={setIsSignedUp} />} />
            <Route path="/login" element={<Login />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
