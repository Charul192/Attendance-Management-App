// App.jsx
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './assets/home.jsx';
import About from './assets/about.jsx';
import SignUp from './assets/SignUp.jsx';
import Login from './assets/login.jsx';
import Analytics from './assets/Analytics.jsx';
import LearnMore from './assets/LearnMore.jsx';
import AddSubject from './assets/AddSubjects.jsx';

// Firebase auth
import { auth } from "./assets/partials/firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // `undefined` = still loading; null = known logged-out; object = logged-in
  const [user, setUser] = useState(undefined);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('onAuthStateChanged ->', firebaseUser);
      setUser(firebaseUser); // firebaseUser is an object or null
    });

    return () => unsubscribe();
  }, []);

  // show loader while auth state is being determined
  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        Loading...
      </div>
    );
  }
  console.log(import.meta.env.VITE_API_KEY)


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <AddSubject /> : <Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route path="/signup" element={<SignUp setIsSignedUp={setIsSignedUp} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:uid/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
