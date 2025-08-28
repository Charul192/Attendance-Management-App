// src/components/Feedback.jsx
import React, { useState, useEffect } from "react";
import NavBar from "./partials/NavBar";
import Footer from "./partials/footer";
import { FaRegMessage } from "react-icons/fa6";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import { FaBug } from "react-icons/fa6";
import { FaLightbulb } from "react-icons/fa";
import { TiFlash } from "react-icons/ti";
import "./feedback.css";

// Firebase imports
import { auth } from "./partials/firebase"; // adjust path if needed
import { onAuthStateChanged } from "firebase/auth";
import { db } from "./partials/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Feedback() {
  const [type, setType] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Get current user email from Firebase Auth
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
      } else {
        // user not logged in — optional: set email to empty or fallback
        setEmail("");
      }
    });
    return () => unsub();
  }, []);

  const handleCancel = () => {
    setType("");
    setThoughts("");
  };

  const handleSend = async () => {
    if (!type) {
      alert("Please select feedback type.");
      return;
    }
    if (!thoughts.trim()) {
      alert("Please share your thoughts.");
      return;
    }

    setSending(true);

    try {
      const docRef = await addDoc(collection(db, "feedback"), {
        type,
        thoughts,
        email: email || "anonymous",
        createdAt: serverTimestamp(),
      });

      console.log("Feedback saved with ID: ", docRef.id);
      alert("Feedback sent successfully ✅");
      // reset
      setType("");
      setThoughts("");
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("There was an error sending feedback. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="feedback">
        <div className="box">
          <div className="heading">
            <div className="icon">
              <FaRegMessage size={32} />
            </div>
            <h3>Feedback</h3>
          </div>

          <div className="line">
            <p>Share your thoughts, report bugs, or suggest improvements</p>
          </div>

          {/* Type Selection */}
          <div className="type">
            <p>Type</p>
            <div className="buttons">
              <button
                className={type === "General" ? "active" : ""}
                onClick={() => setType("General")}
                type="button"
              >
                <BiSolidMessageRounded /> &nbsp; General
              </button>

              <button
                className={type === "Bug" ? "active" : ""}
                onClick={() => setType("Bug")}
                type="button"
              >
                <FaBug color="#14da53ff" /> &nbsp; Bug
              </button>

              <button
                className={type === "Feature" ? "active" : ""}
                onClick={() => setType("Feature")}
                type="button"
              >
                <FaLightbulb color="#ecdd3ffa" /> &nbsp; Feature
              </button>

              <button
                className={type === "Improvement" ? "active" : ""}
                onClick={() => setType("Improvement")}
                type="button"
              >
                <TiFlash color="#ec8a3ffa" /> &nbsp; Improvement
              </button>
            </div>

            <div className="msg">
              <textarea
                placeholder="Share Your Thoughts..."
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* Email (disabled) */}
          <div className="email">
            <p style={{ marginTop: "40px" }}>Email</p>
            <textarea
              className="email"
              disabled
              value={email || "Not signed in"}
            ></textarea>
            <footer>Your email is automatically included</footer>
          </div>

          {/* Buttons */}
          <div className="buttonss">
            <button onClick={handleCancel} type="button" disabled={sending}>
              CANCEL
            </button>
            <button onClick={handleSend} type="button" disabled={sending}>
              {sending ? "SENDING..." : <><IoIosSend /> SEND</>}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
