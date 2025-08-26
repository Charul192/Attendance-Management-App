// Home.jsx
import NavBar from './partials/NavBar';
import Logo from './partials/Logo';
import React, { useEffect, useState } from 'react';
import Tag from './partials/tag';
import SubjectsPage from './partials/SubjectsPage';
import NotificationPrompt from './partials/NotificationPrompt';
import './custom.css';
import { useNavigate } from 'react-router-dom';
import NeedToKnow from './partials/NeedToKnow';

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
  return (
    <>
    <div className="home2">
      <NavBar />
      <br/><br/><br/><br/><br/>
      <Logo/>
      <Tag/>
      <br/>
      <button style={{marginRight: "70px", fontSize: "1.30rem"}} onClick={() => navigate('/SignUp')}>Start Tracking Today</button>
      <button style={{marginLeft: "70px", fontSize: "1.30rem"}}  onClick={() => navigate('/learnmore')}>Learn More</button>
      <NotificationPrompt />
      <br/>
      </div>
      <NeedToKnow/>
      
      
    </>
  );
}
