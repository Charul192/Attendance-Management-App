// SignIn.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../assets/partials/firebase.js"; // ensure firebase exports `app`
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./custom.css";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // entrance animation with GSAP (subtle)
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: -20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Please fill both fields");
      return;
    }

    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCred.user);
      // small success animation
      gsap.to(containerRef.current, { scale: 0.995, duration: 0.08, yoyo: true, repeat: 1 });
      // redirect to home or dashboard
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      setErr(error.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="bg-grid" aria-hidden="true" />
      <div className="neon-orb" />
      <div className="signin-wrap" ref={containerRef}>
        <header className="signin-header">
          <h1 className="brand">BUNK<span>•</span>SMART</h1>
          <p className="tag">Sign in and keep your attendance in check — with style ✨</p>
        </header>

        <form className="signin-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className={`float-label ${email ? "filled" : ""}`}>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                />
            </label>
          </div>

          <div className="input-group">
            <label className={`float-label ${password ? "filled" : ""}`}>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="current-password"
              />
            </label>
          </div>

          {err && <div className="error-box" role="alert">{err}</div>}

          <button className="cta-btn" type="submit" disabled={loading}>
            <span className="glow" />
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="extras">
            <button
              type="button"
              className="ghost-link"
              onClick={() => navigate("/signup")}
            >
              Create an account
            </button>

            <button
              type="button"
              className="ghost-link"
              onClick={() => navigate("/forgot")}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      {/* small footer neon */}
      <div className="signin-footer">
        <small>Made with 🔥 & GSAP</small>
      </div>
    </div>
  );
}
