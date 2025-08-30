// SubjectCharts.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./charts.css";

const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    if (!chart.config.options.plugins || !chart.config.options.plugins.centerText) return;
    const { ctx, width, height } = chart;
    ctx.save();
    const cfg = chart.config.options.plugins.centerText;
    const text = cfg.text ?? "";
    const fontSize = cfg.fontSize ?? Math.round(Math.min(width, height) / 8);
    ctx.font = `700 ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = cfg.color ?? "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  },
};

// colors adjusted for dark background (muted but readable)
const COLORS = {
  present: "#22c55e",      // brighter green
  presentDark: "#16a34a",
  absent: "#dc2626",       // slightly deeper red
  absentLight: "#ef4444",
  remaining: "#475569",    // slate-blue for remaining
  panel: "#0b0f12",
};

// map percentage to bar color (more nuanced)
function pctToBarColor(pct) {
  if (pct >= 85) return "#0ea5a4";
  if (pct >= 75) return "#22c55e";
  if (pct >= 60) return "#a3e635";
  if (pct >= 45) return "#f59e0b";
  if (pct >= 30) return "#fb923c";
  return "#ef4444";
}

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
          const code = raw.Code ?? raw.code ?? `Subject ${d.id}`;
          const presentCount = Number(raw.Present ?? raw.present ?? 0);
          const absentCount = Number(raw.Absent ?? raw.absent ?? 0);
          const classesField = Number(raw.Classes ?? raw.classes ?? 0);
          let totalCount = classesField > 0 ? classesField : presentCount + absentCount;
          if (totalCount === 0 && presentCount > 0) totalCount = presentCount;
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
        setSubjects(items);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setSubjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchSubjects();
    return () => (mounted = false);
  }, [uid]);

  const { totalPresent, totalClasses, totalAbsent, overallPct } = useMemo(() => {
    const tp = subjects.reduce((s, x) => s + (x.presentCount || 0), 0);
    const tc = subjects.reduce((s, x) => s + (x.totalCount || 0), 0);
    const ta = Math.max(0, tc - tp);
    const op = tc > 0 ? Math.round((tp / tc) * 100) : 0;
    return { totalPresent: tp, totalClasses: tc, totalAbsent: ta, overallPct: op };
  }, [subjects]);

  const doughnutData = {
    labels: ["Present", "Absent", "Remaining"],
    datasets: [
      {
        data: [totalPresent, totalAbsent, Math.max(0, totalClasses - totalPresent - totalAbsent)],
        backgroundColor: [COLORS.present, COLORS.absent, COLORS.remaining],
        hoverBackgroundColor: [COLORS.presentDark, COLORS.absentLight, "#64748b"],
        borderWidth: 0,
      },
    ],
  };

  const barLabels = subjects.map((s) => s.code);
  const barData = subjects.map((s) => s.pct);
  const barColors = barData.map((v) => pctToBarColor(v));

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: "Attendance %",
        data: barData,
        backgroundColor: barColors,
        borderRadius: 6,
      },
    ],
  };

  // responsive, smaller sizes
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.4, // a bit shorter than before
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%`, color: "#9aa3b2", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.03)" },
      },
      x: {
        ticks: { color: "#9aa3b2", font: { size: 11 } },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y}%` } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    cutout: "72%", // thinner ring
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#9aa3b2", usePointStyle: true, padding: 12, boxWidth: 10 },
      },
      centerText: { text: `${overallPct}%`, fontSize: 22, color: "#e6eef8" },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}` } },
    },
  };

  return (
    <div className="charts-root chart-padding">
      <div className="charts-header">
        <div className="meta"><strong>Subjects:</strong> {subjects.length}</div>
        <div className="meta"><strong>Overall:</strong> {overallPct}% ({totalPresent}/{totalClasses})</div>
      </div>

      {loading ? (
        <div className="loading">Loading charts…</div>
      ) : subjects.length === 0 ? (
        <div className="empty">No subjects found.</div>
      ) : (
        <>
          <div className="overall-row">
            <div className="overall-card padded-card">
              <h4>Overall Attendance</h4>
              <div className="overall-dough smaller-dough">
                <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerTextPlugin]} />
              </div>
              <div className="overall-stats">
                <span className="dot present" /> {totalPresent} present
                <span className="dot absent" /> {totalAbsent} absent
                <span className="dot remaining" /> {Math.max(0, totalClasses - totalPresent - totalAbsent)} remaining
              </div>
            </div>

            <div className="bar-card padded-card">
              <h4>Attendance % per Subject</h4>
              <div className="bar-wrap shorter-bar">
                <Bar data={barChartData} options={barOptions} />
              </div>
            </div>
          </div>

          <div className="subjectchart condensed-grid">
            {subjects.map((s) => {
              const remaining = Math.max(0, s.totalCount - s.presentCount - s.absentCount);
              const subjectData = {
                labels: ["Present", "Absent", "Remaining"],
                datasets: [
                  {
                    data: [s.presentCount, s.absentCount, remaining],
                    backgroundColor: [COLORS.present, COLORS.absent, COLORS.remaining],
                    hoverBackgroundColor: [COLORS.presentDark, COLORS.absentLight, "#64748b"],
                    borderWidth: 0,
                  },
                ],
              };

              return (
                <div className="subject-card padded-card small-card" key={s.docId}>
                  <h5 className="sub-title">{s.code}</h5>
                  <div className="sub-meta">{s.presentCount}/{s.totalCount} • {s.pct}%</div>
                  <div className="mini-dough smaller-mini">
                    <Doughnut
                      data={subjectData}
                      options={{ maintainAspectRatio: true, aspectRatio: 1, cutout: "68%", plugins: { legend: { display: false } } }}
                    />
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
