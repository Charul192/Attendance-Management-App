import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db } from "./firebase";
import SubjectCard from "./SubjectCard";

export default function SubjectsPage() {
  const [uid, setUid] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!uid) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const colRef = collection(db, "users", uid, "subjects");
    const q = query(colRef, orderBy("createdAt", "desc")); // optional ordering

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSubjects(arr);
        setLoading(false);
      },
      (err) => {
        console.error("subjects onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  if (loading) return <div>Loading…</div>;

  return (
    uid ? (
    <div>
      <h2>Subjects List</h2>
      {subjects.length === 0 ? (
        <p>No subjects found</p>
      ) : (
        subjects.map((subj) => (
          <SubjectCard key={subj.id} subject={subj} uid={uid} />
        ))
      )}
    </div>) : ("")
  );
}