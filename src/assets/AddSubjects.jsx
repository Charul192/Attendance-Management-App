// AddSubject.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from "./partials/NavBar";
import SubjectManager from './partials/SubjectManager';
import SubjectCharts from './partials/Chart';
import './custom.css';
import SubjectsPage from "./partials/SubjectsPage";
import NotificationPrompt from './partials/NotificationPrompt';
import QuoteWidget from './partials/quote';
import Footer from './partials/footer';
import myImg from './Picsart_25-08-28_15-21-20-126.png';

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

export default function AddSubject() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [uid, setUid] = useState(null);

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
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('SW registered', reg);
      return reg;
    } catch (err) {
      console.warn('SW register failed', err);
      return null;
    }
  }

  // Single auth listener: set user/uid, load subjects, and handle FCM token saving
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setUid(firebaseUser?.uid ?? null);

      if (!firebaseUser) {
        console.log('User not signed in');
        setSubjects([]);
        return;
      }

      // async tasks inside non-async callback
      (async () => {
        // load subjects (one-time)
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
            vapidKey: import.meta.env.VITE_VAPID_KEY,
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
      })();
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
      // ensure SW is registered so getToken returns the expected token
      const swReg = await registerSW();

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
        serviceWorkerRegistration: swReg || undefined
      });

      if (token) {
        await removeTokenForUser(current.uid, token);
      }
    } catch (err) {
      console.warn('Could not remove token before logout:', err);
    } finally {
      await auth.signOut();
    }
  }

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <div className="name">
        <img class="image" src={myImg} alt="My edited image" />
        <p>Hey, {user?.displayName ? user.displayName : 'there'}!!</p>
      </div>

      <div className="addsubject">
        <p style={{ fontSize: "1.50rem", fontWeight: "300", marginBottom: "1rem", fontFamily: "Nunito" }}>
          Pick a subject
        </p>
        <SubjectManager uid={uid} />
      </div>

      <div className="subjects">
        <SubjectsPage subjects={subjects} />
      </div>

      {/* <QuoteWidget /> */}
      <Footer />
    </>
  );
}