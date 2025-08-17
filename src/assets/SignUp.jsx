import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "./partials/firebase.js";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import "./custom.css";

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

  // CENTRALIZED write — writes to users/{uid} using setDoc(..., {merge:true})
  const writeData = async (uid, fullName, email) => {
    if (!uid || !email) {
      console.warn("writeData called without uid/email", { uid, email });
      return;
    }
    try {
      const userRef = doc(firestore, "users", uid);
      await setDoc(
        userRef,
        {
          fullName: fullName || "",
          email: email,
          updatedAt: serverTimestamp(),
          uid,
        },
        { merge: true } // don't overwrite existing other fields
      );
    } catch (wErr) {
      console.error("writeData error:", wErr);
      throw wErr;
    }
  };

  // Helper: find legacy user doc by email (random-id records)
  const findLegacyByEmail = async (emailToFind) => {
    if (!emailToFind) return null;
    const usersCol = collection(firestore, "users");
    const q = query(usersCol, where("email", "==", emailToFind));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0]; // first legacy doc
  };

  const signupWithGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google signed in user:", user.uid, user.email);

      // 1) If users/{uid} exists -> just merge/update and continue
      const userRef = doc(firestore, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await writeData(user.uid, user.displayName || "", user.email || "");
        navigate("/");
        return;
      }

      // 2) Check legacy random-id docs by email, do NOT auto-add uid-doc if legacy found
      const legacy = await findLegacyByEmail(user.email);
      if (legacy) {
        console.warn("Found legacy user doc with same email. Aborting auto-create to avoid duplicates.", {
          legacyId: legacy.id,
          legacyData: legacy.data(),
        });
        setErr(
          "An account with this email already exists in our records. Please sign in using that account or contact support to migrate data."
        );
        setLoading(false);
        return;
      }

      // 3) Safe: create users/{uid}
      await writeData(user.uid, user.displayName || "", user.email || "");
      navigate("/");
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error?.code === "auth/account-exists-with-different-credential") {
        setErr(
          "An account with this email exists with a different sign-in method. Try that provider or link accounts."
        );
      } else {
        setErr(error.message || "Google sign-in failed. Please try again.");
      }
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
      // PRE-CHECK: prevent creating duplicates for an email already registered
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods && methods.length > 0) {
        setErr("This email is already registered — try signing in.");
        setLoading(false);
        return;
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      try {
        // set displayName on auth user
        await updateProfile(userCred.user, { displayName: name });
      } catch (profileErr) {
        console.warn("Could not set displayName:", profileErr);
      }

      // IMPORTANT: pass uid first — fixed here
      await writeData(userCred.user.uid, name, email);

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
