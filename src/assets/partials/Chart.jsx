// SubjectCharts.jsx
import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import './charts.css';

export default function SubjectCharts({ uid }) {
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!uid) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    async function fetchSubjects() {
      setLoading(true);
      try {
        const colRef = collection(db, "users", uid, "subjects");
        const snap = await getDocs(colRef);
        if (!mounted) return;

        const items = snap.docs.map((d) => {
          const raw = d.data() || {};

          // Fields from your SubjectManager:
          // Code, Classes, Present, Absent
          const code = raw.Code ?? raw.code ?? `Subject ${d.id}`;
          // prefer numeric conversions
          const presentCount = Number(raw.Present ?? raw.present ?? 0);
          const absentCount = Number(raw.Absent ?? raw.absent ?? 0);
          const classesField = Number(raw.Classes ?? raw.classes ?? 0);

          // Determine total classes:
          // - Prefer Classes field if >0
          // - Otherwise fallback to present+absent
          let totalCount = classesField > 0 ? classesField : presentCount + absentCount;

          // If totalCount still 0 but Present exists, set total = Present (avoid divide by zero)
          if (totalCount === 0 && presentCount > 0) totalCount = presentCount;

          // Compute percent (guard divide by zero)
          const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

          return {
            docId: d.id,
            code,
            presentCount,
            absentCount,
            totalCount,
            pct,
            raw,
          };
        });

        console.log("Fetched subjects (normalized):", items);
        setSubjects(items);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setSubjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSubjects();
    return () => {
      mounted = false;
    };
  }, [uid]);

  // Aggregates for overall charts
  const totalPresent = subjects.reduce((s, x) => s + (x.presentCount || 0), 0);
  const totalClasses = subjects.reduce((s, x) => s + (x.totalCount || 0), 0);
  const totalAbsent = Math.max(0, totalClasses - totalPresent);

  const barLabels = subjects.map((s) => s.code);
  const barData = subjects.map((s) => s.pct);

  const doughnutData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ["#16a34a", "#ef4444"],
        hoverBackgroundColor: ["#22c55e", "#f87171"],
      },
    ],
  };

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Attendance %",
        data: barData,
        backgroundColor: barData.map((v) => (v >= 75 ? "#16a34a" : v >= 50 ? "#f59e0b" : "#ef4444")),
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
      },
    },
    plugins: {
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.y}%` } },
    },
    maintainAspectRatio: false,
  };

  const doughnutOptions = {
    plugins: {
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
      legend: { position: "bottom" },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ fontSize: 13, color: "#9aa3b2" }}>
        {/* <strong>UID:</strong> {uid ?? "not set"} • */} <strong>Subjects:</strong> {subjects.length}
      </div>

      {loading ? (
        <div>Loading charts…</div>
      ) : subjects.length === 0 ? (
        <div>No subjects found.</div>
      ) : (
        <>
          {/* Overall charts */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch" }}>
            <div style={{ flex: "0 0 320px", height: 320 }} className="overall">
              <h4 style={{ margin: "8px 0" }}>Overall Presence</h4>
              <div style={{ height: 260 }} className="overallDough">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <small>
                  {totalPresent} present • {totalAbsent} absent • {totalClasses} total
                </small>
              </div>
            </div>

            <div style={{ flex: "1 1 480px", minWidth: 300, height: 320 }}>
              <h4 style={{ margin: "8px 0" }}>Attendance % per Subject</h4>
              <div style={{ height: 260 }}>
                <Bar data={barChartData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* Per-subject cards */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }} className="subjectchart">
            {subjects.map((s) => {
              const subjectData = {
                labels: ["Present", "Absent", "Left Classes"],
                datasets: [
                  {
                    data: [s.presentCount, Math.max(0, s.absentCount), Math.max(0, s.totalCount)],
                    backgroundColor: ["#16a34a", "#ef4444", "#243575ff"],
                  },
                ],
              };

              return (
                <div
                  className="DoughtNuts"
                  key={s.docId}
                  style={{
                    flex: "0 0 240px",
                    height: 280,
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 12,
                    padding: 10,
                    boxSizing: "border-box",
                  }}
                >
                  <h4 style={{ margin: "6px 0", textAlign: "center", fontSize: 16 }}>{s.code}</h4>
                  <div style={{ fontSize: 11, color: "#9aa3b2", textAlign: "center", marginBottom: 6 }}>
                    {s.presentCount}/{s.totalCount} classes • {s.pct}%
                  </div>

                  <div style={{ height: 150 }}>
                    <Doughnut data={subjectData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}