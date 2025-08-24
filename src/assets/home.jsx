// Home.jsx
import NavBar from './partials/NavBar';
import Logo from './partials/Logo';
import React, { useEffect, useState } from 'react';
import Tag from './partials/tag';
import SubjectsPage from './partials/SubjectsPage';
import NotificationPrompt from './partials/NotificationPrompt';
import './custom.css';
import { useNavigate } from 'react-router-dom';

import { onAuthStateChanged } from "firebase/auth";
import { getToken } from 'firebase/messaging';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

import { db, messaging, auth } from "./partials/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);

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

  async function removeTokenForUser(uid, token) {
    if (!uid || !token) return;
    const tokenRef = doc(db, 'users', uid, 'fcmTokens', token);
    await deleteDoc(tokenRef);
  }

  // Ensure SW is registered (helps getToken)
  async function registerSW() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('SW registered', reg);
        return reg;
      } catch (err) {
        console.warn('SW register failed', err);
        return null;
      }
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);

      if (!firebaseUser) {
        console.log('User not signed in (yet)');
        return;
      }

      // optionally load subjects for the signed-in user
      try {
        const colRef = collection(db, "users", firebaseUser.uid, "subjects");
        const snap = await getDocs(colRef);
        const subjectsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setSubjects(subjectsData);
      } catch (err) {
        console.warn('Could not load subjects:', err);
      }

      // Notification / FCM token flow
      try {
        const swReg = await registerSW();
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission not granted');
          return;
        }

        if (typeof messaging === 'undefined' || !messaging) {
          throw new Error('messaging is undefined — check ./partials/firebase export/import');
        }

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_V_API_KEY,
          serviceWorkerRegistration: swReg || undefined
        });

        if (!token) {
          console.log('No token returned from getToken');
          return;
        }

        await saveTokenForUser(firebaseUser.uid, token);
        console.log('Saved FCM token for user:', firebaseUser.uid);
      } catch (err) {
        console.error('FCM token / permission error:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Logout helper that also removes token
  async function handleLogout() {
    const current = auth.currentUser;
    if (!current) {
      await auth.signOut();
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_V_API_KEY
      });
      if (token) await removeTokenForUser(current.uid, token);
    } catch (err) {
      console.warn('Could not remove token before logout:', err);
    } finally {
      await auth.signOut();
    }
  }


  return (
    <>
      <NavBar />
      <br/><br/><br/><br/><br/>
      <Logo/>
      <Tag/>
      <br/>
      <button style={{marginRight: "70px", fontSize: "1.30rem"}}>Start Tracking Today</button>
      <button style={{marginLeft: "70px", fontSize: "1.30rem"}}  onClick={() => navigate('/learnmore')}>Learn More</button>
      <NotificationPrompt />
      <br/>
      
      {/* pass subjects if you want */}
      <SubjectsPage subjects={subjects} />
    </>
  );
}
