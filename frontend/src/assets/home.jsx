import NavBar from './partials/NavBar'; // Ensure exact filename case
import Logo from './partials/Logo';
import React, {useEffect} from 'react';
import Tag from './partials/tag';
import SubjectCard from './partials/SubjectCard';
import SubjectsPage from './partials/SubjectsPage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getFirestore, doc } from "firebase/firestore";
import { db } from "./partials/firebase";

const auth = getAuth();

export default function Home() {
// useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         // ✅ ab user.uid safe hai
//         const colRef = collection(db, "users", user.uid, "subjects");
//         const snapshot = await getDocs(colRef);

//         const subjectsData = snapshot.docs.map(d => ({
//           id: d.id,
//           ...d.data()
//         }));

//         setSubjects(subjectsData);
//       } else {
//         console.log("No user is logged in");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

  return (
    <>
      <NavBar />
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Logo/>
      <Tag/>
      <br/>
      <br/>
      <br/>
      <SubjectsPage />
    </>
  );
}
