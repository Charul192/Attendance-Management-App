// App.jsx (updated)
import './App.css';
import Home from './assets/home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import About from './assets/about.jsx';
import SignUp from './assets/SignUp.jsx';
import Login from './assets/login.jsx';
import Profile from './assets/Profile.jsx';
import DarkVeil from './assets/DarkVeil.jsx';

// make sure your firebase.js exports: auth, db, messaging
import { messaging, auth, db } from './assets/partials/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp setIsSignedUp={setIsSignedUp} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:uid" element={<Profile />} />
        </Routes>
      </BrowserRouter>

      {/* Optional logout button for testing */}
      {/* <button onClick={handleLogout} style={{ position: 'fixed', bottom: 12, right: 12 }}>
        Logout (remove token)
      </button> */}
    </>
  );
}

export default App;