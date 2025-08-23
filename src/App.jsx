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
import NotificationPrompt from './assets/partials/NotificationPrompt';

// make sure your firebase.js exports: auth, db, messaging
import { messaging, auth, db } from './assets/partials/firebase';
import { getToken } from 'firebase/messaging';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  // Save token under users/{uid}/fcmTokens/{token}
  async function saveTokenForUser(uid, token) {
    if (!uid || !token) throw new Error('missing uid or token');
    const tokenRef = doc(db, 'users', uid, 'fcmTokens', token);
    await setDoc(tokenRef, {
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    });
  }

  // Remove token when logging out (or when you want to delete)
  async function removeTokenForUser(uid, token) {
    if (!uid || !token) return;
    const tokenRef = doc(db, 'users', uid, 'fcmTokens', token);
    await deleteDoc(tokenRef);
  }

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('User not signed in (yet)');
        return;
      }

      try {
        // ask permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission not granted');
          return;
        }

        // get FCM token
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_V_API_KEY
        });

        if (!token) {
          console.log('No token returned from getToken');
          return;
        }

        // save token for this user
        await saveTokenForUser(user.uid, token);
        console.log('Saved FCM token for user:', user.uid);
      } catch (err) {
        console.error('FCM token / permission error:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Example logout button that also removes token
  async function handleLogout() {
    const user = auth.currentUser;
    if (!user) {
      await auth.signOut();
      return;
    }
    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_V_API_KEY
      });
      if (token) {
        await removeTokenForUser(user.uid, token);
      }
    } catch (err) {
      console.warn('Could not remove token before logout:', err);
    } finally {
      await auth.signOut();
    }
  }

  return (
    <>
      <NotificationPrompt />
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