import React, { useState } from "react";
import PixelCard from "./PixelCard";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase"; // adjust path

export default function SubjectCard({ subject, uid }) {
  // local optimistic state
  const [localClasses, setLocalClasses] = useState(subject.Classes ?? 0);
  const [busy, setBusy] = useState(false);

  const noopIfNoUid = () => {
    if (!uid) {
      alert("You must be signed in to update.");
      return true;
    }
    return false;
  };

  const handleNoClass = async () => {
    if (noopIfNoUid()) return;
    if (localClasses <= 0) return; // prevent negative

    setBusy(true);
    setLocalClasses((v) => v - 1); // optimistic UI

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      // atomic decrement
      bunk(subject);
      await updateDoc(ref, { Classes: increment(-1) });
    } catch (err) {
      console.error("Error updating classes:", err);
      // revert optimistic change on error
      setLocalClasses((v) => v + 1);
      alert("Could not update classes. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkPresent = async () => {
    if (noopIfNoUid()) return;
    setBusy(true);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      // increment Present by 1 and optionally decrement Absent if needed
      await updateDoc(ref, { Present: increment(1) });
      // optionally also change Classes or other fields
    } catch (err) {
      console.error("Error marking present:", err);
      alert("Could not mark present.");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAbsent = async () => {
    if (noopIfNoUid()) return;
    setBusy(true);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Absent: increment(1) });
    } catch (err) {
      console.error("Error marking absent:", err);
      alert("Could not mark absent.");
    } finally {
      setBusy(false);
    }
  };

  function calculateFraction(subject) {
  const classes = Number(subject.Classes ?? subject.classes ?? 0);
  const absent = Number(subject.Absent ?? subject.absent ?? 0);
  if (classes <= 0) return 0;
  const result = Math.max(0, Math.min(1, (classes - absent) / classes) * 100);
  return result.toFixed(2);
}

function bunk(subject){
  const classes = Number(subject.Classes ?? subject.classes ?? 0);
  const absent = Number(subject.Absent ?? subject.absent ?? 0);
  if (classes <= 0) return 0;
  const result = ((classes *0.25) - absent);
  return Math.floor(result);
}

const bunkClasses = bunk(subject);

const pct = calculateFraction(subject);

  return (
    <PixelCard variant="blue" className="subject-card">
      <h3>{subject.Code ?? subject.code ?? "Untitled"}</h3>
      <p>Classes: {localClasses}</p>
      <p>Present: {subject.Present ?? 0}</p>
      <p>Absent: {subject.Absent ?? 0}</p>
      <p>Percentage Present: {pct}</p>
      <p>Safe Bunk: {bunkClasses}</p>
      {/* <button onClick={handleMarkPresent} disabled={busy}>
        Mark Present
      </button>
      <br/>
      <br/>
      <button onClick={handleMarkAbsent} disabled={busy}>
        Mark Absent
      </button>
      <br/>
      <br/>
      <button onClick={handleNoClass} disabled={busy || localClasses <= 0}>
        No Class
      </button> */}
    </PixelCard>
  );
}
