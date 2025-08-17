// SignUp.jsx (fixed)
import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "./partials/firebase.js";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./custom.css";
// import logo from "./partials/ChatGPT Image Aug 14, 2025, 10_11_33 PM.png";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);

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

  const writeData = async (fullName, emailId) => {
    if (!emailId) return; // safety
    try {
      await addDoc(collection(firestore, "users"), {
        FullName: fullName || "",
        emailId: emailId,
        createdAt: new Date().toISOString(),
      });
    } catch (wErr) {
      console.error("writeData error:", wErr);
      // optional: setErr("Could not save user data.");
    }
  };

  const signupWithGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google signed in user:", user);

      // write to Firestore (use displayName from Google user)
      await writeData(user.displayName || "", user.email);

      navigate("/"); // redirect after login
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErr("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

      try {
        // set displayName on auth user
        await updateProfile(userCred.user, { displayName: name });
      } catch (profileErr) {
        console.warn("Could not set displayName:", profileErr);
      }

      // write to Firestore after signup
      await writeData(name, email);

      // success animation
      gsap.to(wrapRef.current, { scale: 0.995, duration: 0.06, yoyo: true, repeat: 1 });
      console.log("Signed up:", userCred.user);
      setIsSignedUp(true);
      navigate("/"); // redirect to dashboard/home
    } catch (error) {
      console.error(error);
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

          <button
            className="cta-btn"
            type="button"
            onClick={signupWithGoogle}
            disabled={loading}
          >
            <span className="glow" />
            {loading ? "Please wait..." : "Sign In with Google"}
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
    </div>
  );
}
