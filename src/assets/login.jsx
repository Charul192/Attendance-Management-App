// SignIn.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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

  // --- Forgot password states ---
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetErr, setResetErr] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const modalRef = useRef(null);

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

  // animate modal when opened
  useEffect(() => {
    if (showReset && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: -20, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.25, ease: "power3.out" }
      );
      // prefill with current email if available
      if (email) setResetEmail(email);
      setResetErr("");
      setResetSuccess("");
    }
  }, [showReset, email]);

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

  // Forgot password handler
  const handlePasswordReset = async () => {
    setResetErr("");
    setResetSuccess("");

    if (!resetEmail) {
      setResetErr("Please enter your email first.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess("Password reset email sent. Check your inbox (and spam).");
    } catch (error) {
      console.error("Reset error:", error);
      // Friendly message mapping (simple)
      const msg = error?.code
        ? (error.code === "auth/user-not-found"
            ? "No user found with that email."
            : error.message)
        : "Could not send reset email.";
      setResetErr(msg);
    } finally {
      setResetLoading(false);
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

            {/* Open inline reset modal instead of navigating */}
            <button
              type="button"
              className="ghost-link"
              onClick={() => setShowReset(true)}
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

      {/* --- Reset Password Modal --- */}
      {showReset && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Reset password">
          <div className="reset-modal" ref={modalRef}>
            <h3>Reset your password</h3>
            <p>Enter the email to receive a password reset link.</p>

            <div className="input-group">
              <label className={`float-label ${resetEmail ? "filled" : ""}`}>
                Email
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            {resetErr && <div className="error-box" role="alert">{resetErr}</div>}
            {resetSuccess && <div className="success-box" role="status">{resetSuccess}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="cta-btn"
                onClick={handlePasswordReset}
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send reset email"}
              </button>

              <button
                type="button"
                className="ghost-link"
                onClick={() => {
                  setShowReset(false);
                  setResetErr("");
                  setResetSuccess("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
