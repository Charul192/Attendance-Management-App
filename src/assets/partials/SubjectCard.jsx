import React, { useState, useEffect } from "react";
import PixelCard from "./PixelCard";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase"; // adjust path

export default function SubjectCard({ subject, uid }) {
  // optimistic local state synced from subject props
  const [localClasses, setLocalClasses] = useState(Number(subject?.Classes ?? 0));
  const [localPresent, setLocalPresent] = useState(Number(subject?.Present ?? 0));
  const [localAbsent, setLocalAbsent] = useState(Number(subject?.Absent ?? 0));
  const [busy, setBusy] = useState(false);

  // keep local copies in sync when subject prop changes (server update arrives)
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

  // helpers
  const calculatePercentage = (present, total) => {
    const p = Number(present || 0);
    const t = Number(total || 0);
    if (t <= 0) return "0.00";
    return ((p / t) * 100).toFixed(2);
  };

  function bunkCalc(pct, classes, absent) {
    // safe bunk calculation based on percentage requirement stored in subject.percentage
    const percentage = Number(pct ?? subject?.percentage ?? 0);
    const cls = Number(classes ?? 0);
    const abs = Number(absent ?? 0);
    if (cls <= 0) return 0;
    const allowed = Math.floor((cls * ((100 - percentage) / 100)) - abs);
    return Math.max(0, allowed);
  }

  // Derived state: disable present/absent when we've already recorded attendance for all classes
  const attendanceFilled = Number(localPresent + localAbsent) >= Number(localClasses);

  // --- action handlers with optimistic UI and revert on error ---
  const handleNoClass = async () => {
    if (noopIfNoUid()) return;
    if (localClasses <= 0) return; // nothing to decrement

    setBusy(true);
    setLocalClasses((v) => Math.max(0, v - 1)); // optimistic

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Classes: increment(-1) });
    } catch (err) {
      console.error("Error updating classes (no class):", err);
      // revert
      setLocalClasses((v) => v + 1);
      alert("Could not update classes. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleExtraClass = async () => {
    if (noopIfNoUid()) return;

    setBusy(true);
    setLocalClasses((v) => v + 1); // optimistic

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Classes: increment(1) });
    } catch (err) {
      console.error("Error updating classes (extra class):", err);
      // revert
      setLocalClasses((v) => Math.max(0, v - 1));
      alert("Could not add extra class. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkPresent = async () => {
    if (noopIfNoUid()) return;
    // don't allow marking when attendance already filled
    if (attendanceFilled) return;

    setBusy(true);
    // optimistic: increment both Present and Classes (a class happened)
    setLocalPresent((p) => p + 1);
    setLocalClasses((c) => c + 1);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Present: increment(1), Classes: increment(1) });
    } catch (err) {
      console.error("Error marking present:", err);
      // revert optimistic changes
      setLocalPresent((p) => Math.max(0, p - 1));
      setLocalClasses((c) => Math.max(0, c - 1));
      alert("Could not mark present. See console.");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAbsent = async () => {
    if (noopIfNoUid()) return;
    if (attendanceFilled) return;

    setBusy(true);
    // optimistic: increment Absent and Classes
    setLocalAbsent((a) => a + 1);
    setLocalClasses((c) => c + 1);

    try {
      const ref = doc(db, "users", uid, "subjects", subject.id);
      await updateDoc(ref, { Absent: increment(1), Classes: increment(1) });
    } catch (err) {
      console.error("Error marking absent:", err);
      // revert optimistic changes
      setLocalAbsent((a) => Math.max(0, a - 1));
      setLocalClasses((c) => Math.max(0, c - 1));
      alert("Could not mark absent. See console.");
    } finally {
      setBusy(false);
    }
  };

  // computed values for display
  const pctPresent = calculatePercentage(localPresent, localClasses);
  const safeBunks = bunkCalc(subject?.percentage, localClasses, localAbsent);

  return (
    <PixelCard variant="blue" className="subject-card">
      <h3>{subject?.Code ?? subject?.code ?? "Untitled"}</h3>
      <p>Classes: {localClasses}</p>
      <p>Present: {localPresent}</p>
      <p>Absent: {localAbsent}</p>
      <p>Percentage Present: {pctPresent}%</p>
      <p>Safe Bunk: {safeBunks}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        <button onClick={handleMarkPresent} disabled={busy || attendanceFilled}>
          Mark Present
        </button>

        <button onClick={handleMarkAbsent} disabled={busy || attendanceFilled}>
          Mark Absent
        </button>

        <button onClick={handleNoClass} disabled={busy || localClasses <= 0}>
          No Class
        </button>

        {/* Extra class should be allowed even when classes === 0 */}
        <button onClick={handleExtraClass} disabled={busy}>
          Extra Class
        </button>
      </div>
    </PixelCard>
  );
}
