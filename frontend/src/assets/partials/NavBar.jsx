import PillNav from "./PillNav";
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "./firebase.js";

const auth = getAuth(app);

export default function NavBar() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState([]);

  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate('/');
  } catch (err) {
    console.error("Logout error:", err);
    // optionally show message then still navigate or not
  }
};

  useEffect(() => {
    // subscribe to auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setNavItems([
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: user.displayName || "Profile", href: `/${user.uid}` }, // safer than /:id
          { label: "Log Out", onClick: handleLogout }
        ]);
      } else {
        setNavItems([
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Login", href: "/login" },
          { label: "SignUp", href: "/signup" },
        ]);
      }
    });

    // cleanup when component unmounts
    return () => unsubscribe();
  }, []); // ✅ dependency array goes here

  return (
    <PillNav
      items={navItems}
      activeHref="/"
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#242424"
      pillColor="#3A3A3A"
      hoveredPillTextColor="#ffffff"
      pillTextColor="#FFFFFF"
    />
  );
}
