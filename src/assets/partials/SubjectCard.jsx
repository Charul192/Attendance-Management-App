import React, { useState, useEffect } from "react";
import PixelCard from "./PixelCard";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase"; // adjust path

export default function SubjectCard({ subject, uid }) {
  const [localClasses, setLocalClasses] = useState(Number(subject?.Classes ?? 0));
  const [localPresent, setLocalPresent] = useState(Number(subject?.Present ?? 0));
  const [localAbsent, setLocalAbsent] = useState(Number(subject?.Absent ?? 0));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLocalClasses(Number(subject?.Classes ?? 0));
    setLocalPresent(Number(subject?.Present ?? 0));
    setLocalAbsent(Number(subject?.Absent ?? 0));
  }, [subject?.Classes, subject?.Present, subject?.Absent]);

  const noopIfNoUid = () => {
    if (!uid) {
      alert("You must be signed in to update.");
      return true;
    }
    return false;
  };

  const calculatePercentage = (present, total) => {
    const p = Number(present || 0);
    const t = Number(total || 0);
    if (t <= 0) return "0.00";
    return ((p / t) * 100).toFixed(2);
  };

  // NEW: correct safe-bunks formula (based on present/(total + x) >= requiredPct)
  function safeBunksCalc(requiredPct, present, total, absent) {
    const R = Number(requiredPct ?? 0);
    const a = Number(present ?? 0);
    const n = Number(total ?? 0);
    const ab = Number(absent ?? 0)

    if (R <= 0) {
      // If no requirement, you could allow "infinite" bunks — show 0 to be safe
      return 0;
    }
    // x <= (present * 100 / R) - n
    const allowed = Math.floor((n*((100 - R)/100)) - ab);
    return Math.max(0, allowed);
  }

  const handleMarkPresent = async () => {
    if (noopIfNoUid()) return;
    setBusy(true);

    // optimistic
    setLocalPresent((p) => p + 1);
    setLocalClasses((c) => c + 1);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Present: increment(1), Classes: increment(1) });
    } catch (err) {
      console.error("Error marking present:", err);
      setLocalPresent((p) => Math.max(0, p - 1));
      setLocalClasses((c) => Math.max(0, c - 1));
      alert("Could not mark present. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAbsent = async () => {
    if (noopIfNoUid()) return;
    setBusy(true);

    // optimistic
    setLocalAbsent((a) => a + 1);
    setLocalClasses((c) => c + 1);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Absent: increment(1), Classes: increment(1) });
    } catch (err) {
      console.error("Error marking absent:", err);
      setLocalAbsent((a) => Math.max(0, a - 1));
      setLocalClasses((c) => Math.max(0, c - 1));
      alert("Could not mark absent. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleNoClass = async () => {
    if (noopIfNoUid()) return;
    if (localClasses <= 0) return;
    setBusy(true);
    setLocalClasses((v) => Math.max(0, v - 1));
    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Classes: increment(-1) });
    } catch (err) {
      console.error("Error (no class):", err);
      setLocalClasses((v) => v + 1);
      alert("Could not update classes. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleExtraClass = async () => {
    if (noopIfNoUid()) return;
    setBusy(true);
    setLocalClasses((v) => v + 1);
    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Classes: increment(1) });
    } catch (err) {
      console.error("Error (extra class):", err);
      setLocalClasses((v) => Math.max(0, v - 1));
      alert("Could not add extra class. See console.");
    } finally {
      setBusy(false);
    }
  };

  const pctPresent = calculatePercentage(localPresent, localClasses);
  const safeBunks = safeBunksCalc(subject.percentage, localPresent, localClasses, localAbsent);

  return (
    <PixelCard variant="blue" className="subject-card">
      <h3>{subject?.Code ?? subject?.code ?? "Untitled"}</h3>
      <p>Classes: {localClasses}</p>
      <p>Present: {localPresent}</p>
      <p>Absent: {localAbsent}</p>
      <p>Percentage Present: {pctPresent}%</p>
      <p>
        Safe Bunks: <strong>{safeBunks}</strong>
        {safeBunks === 0 && <span style={{ color: "#f97316", marginLeft: 8 }}> (No safe bunks left)</span>}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <button onClick={handleMarkPresent} disabled={busy}>
          Mark Present
        </button>

        <button onClick={handleMarkAbsent} disabled={busy}>
          Mark Absent
        </button>

        {/* <button onClick={handleNoClass} disabled={busy || localClasses <= 0}>
          No Class
        </button>

        <button onClick={handleExtraClass} disabled={busy}>
          Extra Class
        </button> */}
      </div>
    </PixelCard>
  );
}
