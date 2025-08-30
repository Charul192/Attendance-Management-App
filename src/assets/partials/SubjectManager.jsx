import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { app, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const firestore = getFirestore(app);

export default function SubjectManager() {
  // entries store objects with shape: { id, code, classes, percentage, savedAt }
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem("subjects_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentUid, setCurrentUid] = useState(auth.currentUser?.uid ?? null);
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // keep localStorage in sync with entries
  useEffect(() => {
    localStorage.setItem("subjects_v1", JSON.stringify(entries));
  }, [entries]);

  // listen to auth state changes and store uid
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // load subjects from Firestore for the signed-in user (replaces local list)
  useEffect(() => {
    let mounted = true;
    const loadFromFirestore = async () => {
      if (!currentUid) return;
      setLoading(true);
      try {
        const snap = await getDocs(collection(firestore, "users", currentUid, "subjects"));
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            code: data.Code ?? data.code ?? "",
            classes: Number(data.Classes ?? data.classes ?? 0),
            percentage: Number(data.percentage ?? 0),
            savedAt: data.savedAt ?? new Date().toISOString(),
          };
        });
        if (!mounted) return;
        // Replace local entries with server list. If you prefer merging, change this.
        setEntries(list);
      } catch (err) {
        console.error("Could not load subjects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFromFirestore();
    return () => {
      mounted = false;
    };
  }, [currentUid]);

  // normalize helper
  const normalize = (s) => (s || "").trim().toUpperCase();

  // create a subject under users/{uid}/subjects and return firestore id
  // now accepts `percentage` from user and writes it to the doc
  const makeSubCollection = async (code, classes, percentage) => {
    const uid = currentUid;
    if (!uid) throw new Error("User not signed in");
    const docRef = await addDoc(collection(firestore, "users", uid, "subjects"), {
      Code: code,
      Classes: classes,
      Present: 0,
      Absent: 0,
      percentage: Number(percentage ?? 0),
      savedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      createdBy: uid,
    });
    return docRef.id; // firestore-generated string id
  };

  // save handler now expects entry.id to be a firestore id (string)
  const handleSave = (entry) => {
    setEntries((prev) => [{ ...entry }, ...prev]);
    setShowForm(false);
    setMessage("Subject saved.");
    setTimeout(() => setMessage(""), 2000);
  };

  // delete handler: optimistic UI, revert on error. Only attempts remote delete when id is a string.
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    // optimistic UI
    const old = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));

    // if id is not a string, it's a local-only item (skip remote delete)
    if (typeof id !== "string") {
      console.warn("Skipping remote delete for local-only id:", id);
      return;
    }

    const uid = currentUid;
    if (!uid) {
      alert("Please sign in to delete subjects from the server.");
      setEntries(old); // revert
      return;
    }

    try {
      const ref = doc(firestore, "users", uid, "subjects", id);
      await deleteDoc(ref);
    } catch (err) {
      console.error("Error deleting document:", err);
      setEntries(old); // revert optimistic update
      alert("Could not delete subject from server. See console.");
    }
  };

  const handleAddMore = () => setShowForm(true);

  const handleClearAll = async () => {
    if (!window.confirm("Clear all saved subjects? This will remove them locally and from server. Proceed?")) return;

    const uid = currentUid;
    const old = entries;

    // optimistic: clear local UI and storage
    setEntries([]);
    localStorage.removeItem("subjects_v1");

    // if user not signed in, we are done (local-only clear)
    if (!uid) return;

    try {
      setLoading(true);
      // fetch all docs under users/{uid}/subjects and delete them in parallel
      const snap = await getDocs(collection(firestore, "users", uid, "subjects"));
      if (!snap.empty) {
        const deletions = snap.docs.map((d) => deleteDoc(doc(firestore, "users", uid, "subjects", d.id)));
        await Promise.all(deletions);
      }
    } catch (err) {
      console.error("Could not clear server subjects:", err);
      // revert local change
      setEntries(old);
      localStorage.setItem("subjects_v1", JSON.stringify(old));
      alert("Could not clear subjects from server. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.addBox}>
        <h2 style={styles.title}>Add Subject & Classes</h2>

        {showForm ? (
          <SubjectForm onSave={handleSave} makeSubCollection={makeSubCollection} />
        ) : (
          <div style={styles.savedNotice}>
            <span>{message || "Saved — want to add more?"}</span>
            <button style={styles.addMoreBtn} onClick={handleAddMore}>
              Add more
            </button>
          </div>
        )}
      </div>

      <div style={styles.listHeader}>
        <h3 style={styles.savedHeading}>Saved Subjects ({entries.length})</h3>
        <div>
          <button style={styles.clearBtn} onClick={handleClearAll}>
            Clear all
          </button>
        </div>
      </div>

      {loading ? <div style={{ padding: 8 }}>Loading subjects…</div> : null}

      <SubjectList entries={entries} onDelete={handleDelete} />
    </div>
  );
}

/* Subject form component */
function SubjectForm({ onSave, makeSubCollection }) {
  const [code, setCode] = useState("");
  const [classes, setClasses] = useState("");
  const [percentage, setPercentage] = useState(""); // new input (0-100)
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCode("");
    setClasses("");
    setPercentage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedCode = (code || "").trim();
    const num = Number(classes);
    const pct = Number(percentage);

    if (!trimmedCode) {
      setError("Subject code required.");
      return;
    }
    if (classes === "" || Number.isNaN(num) || num <= 0) {
      setError("Enter a valid number of classes (positive).");
      return;
    }
    if (percentage === "" || Number.isNaN(pct) || pct < 0 || pct > 100) {
      setError("Enter a valid percentage (0–100).");
      return;
    }

    setSaving(true);
    try {
      // create document and get firestore id (passes percentage)
      const newId = await makeSubCollection(trimmedCode, num, pct);
      onSave({ id: newId, code: trimmedCode, classes: num, percentage: pct, savedAt: new Date().toISOString() });
      reset();
    } catch (err) {
      console.error("Failed to save subject:", err);
      alert("Could not save subject. Make sure you're signed in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Subject code
        <input
          style={styles.input}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. MATH101"
          autoComplete="off"
        />
      </label>

      <label style={styles.label}>
        Number of classes
        <input
          style={styles.input}
          value={classes}
          onChange={(e) => setClasses(e.target.value)}
          placeholder="e.g. 42"
          inputMode="numeric"
        />
      </label>

      <label style={styles.label}>
        Required Percentage (%)
        <input
          style={styles.input}
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          placeholder="e.g. 75"
          inputMode="numeric"
        />
      </label>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.buttonsRow}>
        <button type="submit" style={styles.saveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          style={styles.cancelBtn}
          onClick={() => {
            reset();
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

/* List component */
function SubjectList({ entries, onDelete }) {
  if (!entries || entries.length === 0) {
    return <div style={styles.empty}>No subjects added yet.</div>;
  }

  return (
    <div style={styles.listWrap}>
      {entries.map((e) => (
        <div key={e.id} style={styles.card}>
          <div style={styles.cardLeft}>
            <div style={styles.cardTitle}>{e.code}</div>
            <div style={styles.cardMeta}>
              {e.classes} classes • {e.percentage ?? 0}% •{" "}
              {new Date(e.savedAt).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
          </div>
          <div style={styles.cardRight}>
            <button style={styles.delBtn} onClick={() => onDelete(e.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 760,
    margin: "1rem auto",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(66, 66, 112, 0.65)",
    background: "linear-gradient(180deg, var(--card-bg), rgba(255, 255, 255, 0.2))",
    border: "1px solid var(--outline)",
    color: "var(--text)",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  title: { margin: "0 0 12px 0", fontSize: 20, color: "var(--text)" },
  savedHeading: { margin: 0, color: "var(--muted)" },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    alignItems: "end",
    marginBottom: 12,
  },
  label: { display: "flex", flexDirection: "column", fontSize: 13, color: "var(--muted)" },
input: {
    marginTop: 6,
    padding: "0.625rem 0.75rem",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid var(--outline)",
    background: "var(--card-bg)",
    color: "var(--text)",
    outline: "none",
  },
  buttonsRow: { gridColumn: "1 / -1", display: "flex", gap: 8 },
  saveBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
    color: "#0b0f12",
    fontWeight: 700,
    boxShadow: "0 8px 32px var(--shadow-neon)",
  },
  cancelBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--outline)",
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
  },
  error: { color: "var(--error)", gridColumn: "1 / -1", fontSize: 13 },
  savedNotice: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
    color: "var(--muted)",
  },
  addMoreBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
  },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  clearBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--outline)",
    background: "transparent",
    color: "var(--muted)",
    cursor: "pointer",
  },
  empty: { padding: 12, color: "var(--muted)" },
  listWrap: { marginTop: 12, display: "grid", gap: 8 },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.03)",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.06))",
    color: "var(--text)",
  },
  cardLeft: {},
  cardTitle: { fontWeight: 700, fontSize: 15, color: "var(--text)" },
  cardMeta: { fontSize: 13, color: "var(--muted)", marginTop: 6 },
  cardRight: {},
  delBtn: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,78,205,0.12)",
    background: "transparent",
    color: "var(--accent)",
    cursor: "pointer",
  },
  addBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    background: "linear-gradient(180deg, #20242bff 0%, #0c0e12ff 100%)",
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 24px rgba(6,8,20,0.6)",
  },
};
