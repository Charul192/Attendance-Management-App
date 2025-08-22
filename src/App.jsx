import viteLogo from '/vite.svg'
import './App.css'
import Home from './assets/home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from "react";
// import BackGround from './assets/partials/background';
import About from './assets/about.jsx';
import SignUp from './assets/SignUp.jsx';
import Login from './assets/login.jsx';
import Profile from './assets/Profile.jsx';
import DarkVeil from './assets/DarkVeil.jsx';
import NotificationPrompt from './assets/partials/NotificationPrompt';

function App() {
  //request user for notification permission
  // function requestPermission(){
  //   return Notification.requestPermission()
  //   .then(permission => {
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted.');
  //       // generate token or do something
  //     } else if (permission === 'denied') {
  //       alert('You denied the notification permission');
  //     } else {
  //       console.log('Permission default or dismissed:', permission);
  //     }
  //     return permission;
  //   })
  //   .catch(err => {
  //     console.error('Request failed', err);
  //     throw err;
  //   });
  // }
const [isSignedUp, setIsSignedUp] = useState(false);
// useEffect(() => {
//   requestPermission()
// }, []);
  return (
    <>
    {/* <div style={{ width: '100%', height: '600px', position: 'relative' }}>
  <DarkVeil />
</div> */}
    <NotificationPrompt/>
     <BrowserRouter>
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp setIsSignedUp={setIsSignedUp} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/:uid" element={<Profile />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
