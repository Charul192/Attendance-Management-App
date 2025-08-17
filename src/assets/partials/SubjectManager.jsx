import React, { useState, useEffect } from "react";
import {getFirestore, collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {app, auth} from './firebase'; 

const firestore = getFirestore(app);
const uid = auth.currentUser?.uid;

export default function SubjectManager() {
  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem("subjects_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const normalize = (s) => (s || "").trim().toUpperCase();

  const makeSubCollection = async(code, classes) => {
    const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User not signed in");
    await addDoc(collection(firestore, 'users' , uid ,'subjects'), {
      Code: code,
      Classes: classes,
      Present: 0,
      Absent: 0,
      savedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      createdBy: uid,
    })
  }

  const [showForm, setShowForm] = useState(true); // show form initially
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("subjects_v1", JSON.stringify(entries));
  }, [entries]);

  const handleSave = (entry) => {
    setEntries((prev) => [{ ...entry, id: Date.now() }, ...prev]);
    setShowForm(false); // hide form after save; user can click Add more
    setMessage("Subject saved.");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this subject?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddMore = () => {
    setShowForm(true);
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all saved subjects?")) return;
    setEntries([]);
    localStorage.removeItem("subjects_v1");
  };

  return (
    <div style={styles.container}>
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

      <div style={styles.listHeader}>
        <h3 style={styles.savedHeading}>Saved Subjects ({entries.length})</h3>
        <div>
          <button style={styles.clearBtn} onClick={handleClearAll}>
            Clear all
          </button>
        </div>
      </div>

      <SubjectList entries={entries} onDelete={handleDelete} />
    </div>
  );
}

/* Subject form component */
function SubjectForm({ onSave, makeSubCollection }) {
  const [code, setCode] = useState("");
  const [classes, setClasses] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setCode("");
    setClasses("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedCode = (code || "").trim();
    const num = Number(classes);

    if (!trimmedCode) {
      setError("Subject code required.");
      return;
    }
    if (!classes || Number.isNaN(num) || num <= 0) {
      setError("Enter a valid number of classes (positive).");
      return;
    }

    setSaving(true);
    // simulate small delay
    setTimeout( async() => {
      await makeSubCollection(trimmedCode, num);
      onSave({
        code: trimmedCode,
        classes: num,
        savedAt: new Date().toISOString(),
      });
      reset();
      setSaving(false);
    }, 250);
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

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.buttonsRow}>
        <button type="submit" style={styles.saveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          style={styles.cancelBtn}
          onClick={() => {
            setCode("");
            setClasses("");
            setError("");
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
              {e.classes} classes •{" "}
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

/* inline styles using CSS variables for theme consistency */
const styles = {
  container: {
    maxWidth: 760,
    margin: "16px auto",
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 8px 28px rgba(2,2,8,0.6)",
    background: "linear-gradient(180deg, var(--card-bg), rgba(255,255,255,0.01))",
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
    padding: "10px 12px",
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
    background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
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
};
