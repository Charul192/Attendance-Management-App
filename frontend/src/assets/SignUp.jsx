// SignUp.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { app } from "./partials/firebase.js"; // ensure this exports `app`
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./custom.css";
import logo from "./partials/ChatGPT Image Aug 14, 2025, 10_11_33 PM.png"; // replace with your actual logo path

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function SignUp() {
  const [name, setName] = useState(""); // new
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const [isSignedUp, setIsSignedUp] = useState(false);

  const signupWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("Google signed in user:", result.user);
        navigate("/"); // redirect after login
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        setErr("Google sign-in failed. Please try again.");
      });
  };

  useEffect(() => {
    if (wrapRef.current) {
      gsap.fromTo(
        wrapRef.current,
        { y: -16, opacity: 0, scale: 0.995 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const resetErrors = () => setErr("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    // validate name too
    if (!name || !email || !password || !confirm) {
      setErr("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName on the created user
      try {
        await updateProfile(userCred.user, { displayName: name });
        // optionally you can also update auth.currentUser, but userCred.user should be fine
      } catch (profileErr) {
        console.warn("Could not set displayName:", profileErr);
        // don't fail the whole signup just because displayName update failed
      }

      // success animation
      gsap.to(wrapRef.current, { scale: 0.995, duration: 0.06, yoyo: true, repeat: 1 });
      console.log("Signed up:", userCred.user);
      setIsSignedUp(true);
      navigate("/"); // redirect to dashboard/home
    } catch (error) {
      console.error(error);
      // Friendly error messages
      if (error.code === "auth/email-already-in-use") {
        setErr("This email is already registered — try signing in.");
      } else if (error.code === "auth/invalid-email") {
        setErr("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setErr("Password is too weak.");
      } else {
        setErr(error.message || "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-grid" aria-hidden="true" />
      <div className="neon-orb" />
      <div className="signup-wrap" ref={wrapRef}>
        <header className="signup-header">
          {/* <img src={logo} alt="Bunk Smart" className="brand-logo" /> */}
          <h1 className="brand">Bunk Smart</h1>
          <p className="tag">Create your account — get smarter about attendance</p>
        </header>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className={`float-label ${name ? "filled" : ""}`}>
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
          </div>

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
                placeholder="6+ characters"
                autoComplete="new-password"
              />
            </label>
          </div>

          <div className="input-group">
            <label className={`float-label ${confirm ? "filled" : ""}`}>
              Confirm Password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </label>
          </div>

          {err && <div className="error-box" role="alert">{err}</div>}

          <button className="cta-btn" type="submit" disabled={loading}>
            <span className="glow" />
            {loading ? "Creating account..." : "Create account"}
          </button>

          <button className="cta-btn" type="button" onClick={signupWithGoogle}>
            <span className="glow" />
            Sign In with Google
          </button>

          <div className="extras">
            <button
              type="button"
              className="ghost-link"
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </button>
            <button
              type="button"
              className="ghost-link"
              onClick={() => navigate("/")}
            >
              Back home
            </button>
          </div>
        </form>
      </div>

      {/* <div className="signup-footer">
        <small>Built with 🔥 — Bunk Smart</small>
      </div> */}
    </div>
  );
}