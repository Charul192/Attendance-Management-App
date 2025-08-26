import React, { useState } from "react";
import NavBar from "./partials/NavBar";
import PixelCard from "./partials/PixelCard";
import footer from "./partials/footer";

/**
 * Creative About / Help page
 * - Uses PixelCard as a canvas (background animation already handled there)
 * - Tailwind utility classes used for quick layout. If you don't have Tailwind,
 *   the inline styles will keep it looking decent.
 */

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      q: "How do I add a subject?",
      a: "Click Add Subject → enter Subject Code and Total Classes → Save. The subject will be saved to your account and appear instantly."
    },
    {
      q: "What does No Class do?",
      a: "No Class subtracts 1 from Total Classes (use only when a lecture is cancelled). This keeps your percentage accurate."
    },
    {
      q: "Can I use this app on multiple devices?",
      a: "Yes — just sign in with the same account on all devices. Changes sync in real time."
    },
    {
      q: "I deleted a subject by mistake. Can I restore it?",
      a: "Deleted subjects cannot be restored. If it was important, contact support with details and we’ll check logs (if available)."
    }
  ];

  return (
    <>
      <NavBar />

      <div style={{ padding: "28px 16px", display: "flex", justifyContent: "center" }}>
        <PixelCard variant="blue" className="max-w-4xl w-full p-6" >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
            {/* HERO / HEADLINE */}
            <div>
              <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.05 }}>
                Attendance Tracker — <span style={{ color: "#be185d" }}>Smart, Simple, Reliable</span>
              </h1>
              <p style={{ marginTop: 10, color: "rgba(254, 254, 254, 0.86)" }}>
                Add subjects, mark Present/Absent, manage cancelled classes, and watch your attendance update in real time.
                Built to be fast, private, and easy to use.
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <a href="/add" style={ctaStyle}>Add Subject</a>
                <a href="/subjects" style={ghostStyle}>View Subjects</a>
              </div>

              {/* Quick bulleted perks */}
              <ul style={{ marginTop: 18, paddingLeft: 18, color: "rgba(255, 255, 255, 0.8)" }}>
                <li style={{ marginBottom: 8 }}>Real-time sync across devices</li>
                <li style={{ marginBottom: 8 }}>Atomic updates (no lost clicks)</li>
                <li style={{ marginBottom: 8 }}>Simple actions: Mark Present / Mark Absent / No Class</li>
              </ul>
            </div>

            {/* Decorative mini-panel (progress + quick stats) */}
            <aside style={asideStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={ringBase}>
                  <div style={ringFill}></div>
                  <div>80%</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>On track</div>
                  <div style={{ fontSize: 13, color: "rgba(133, 140, 239, 0.7)" }}>Targets & buffer shown</div>
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div style={miniStat}>
                <div style={{ fontSize: 12, color: "rgba(12,12,12,0.7)" }}>Total Classes</div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>10</div>
              </div>

              <div style={{ height: 10 }} />

              <div style={miniStat}>
                <div style={{ fontSize: 12, color: "rgba(12,12,12,0.7)" }}>Absent</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#ef4444" }}>2</div>
              </div>
            </aside>
          </div>

          {/* Divider */}
          <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid rgba(0,0,0,0.06)" }} />

          {/* HOW-TO STEPS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { emoji: "➕", title: "Add", text: "Quickly add a subject with code & total classes." },
              { emoji: "✅", title: "Mark", text: "Mark Present or Absent with a single tap." },
              { emoji: "⛔", title: "No Class", text: "Cancelled class? Decrease total classes." }
            ].map((step, i) => (
              <div key={i} style={stepCard}>
                <div style={{ fontSize: 20 }}>{step.emoji}</div>
                <div style={{ marginLeft: 10 }}>
                  <div style={{ fontWeight: 700 }}>{step.title}</div>
                  <div style={{ fontSize: 13, color: "rgba(252, 250, 250, 0.65)" }}>{step.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ accordion */}
          <div style={{ marginTop: 18 }}>
            <h3 style={{ margin: "8px 0 12px", fontSize: 16 }}>Frequently asked</h3>

            <div style={{ display: "grid", gap: 8 }}>
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "10px 12px",
                        background: open ? "rgba(135, 115, 249, 0.1)" : "transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{f.q}</div>
                      <div style={{ opacity: 0.8 }}>{open ? "–" : "+"}</div>
                    </button>
                    {open && (
                      <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.02)", color: "rgba(162, 184, 235, 0.8)" }}>
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* small footer */}
          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(191, 191, 236, 0.6)" }}>
              Need more help? Contact us<strong>BunkSmart@gmail.com</strong>
            </div>
          </div>
        </PixelCard>
      </div>
      <footer/>
    </>
  );
}

/* Inline styles used so this works without external CSS; replace with your classes if needed */
const ctaStyle = {
  background: "linear-gradient(90deg,#fb7185,#f472b6)",
  color: "white",
  padding: "8px 12px",
  borderRadius: 8,
  fontWeight: 700,
  textDecoration: "none"
};
const ghostStyle = {
  border: "1px solid rgba(255, 255, 255, 0.1)",
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: "rgba(252, 250, 250, 0.8)"
};
const asideStyle = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
  padding: 12,
  borderRadius: 12,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)"
};
const ringBase = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "conic-gradient(#ec4899 0% 60%, rgba(0,0,0,0.06) 60% 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#111",
  fontWeight: 800
};
const ringFill = {
  // decorative inner circle (keeps it lively)
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "white",
  position: "absolute",
  transform: "translateX(-9999px)" // intentionally hidden; PixelCard canvas is primary visual
};
const miniStat = { display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px dashed rgba(0,0,0,0.04)" };

const stepCard = {
  display: "flex",
  alignItems: "center",
  padding: 12,
  borderRadius: 10,
  background: "linear-gradient(180deg, rgba(120, 131, 232, 0.2), rgba(113, 100, 100, 0))"
};