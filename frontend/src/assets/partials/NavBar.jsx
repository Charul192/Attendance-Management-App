import PillNav from "./PillNav";
import React, {useState} from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "./firebase.js";

const auth = getAuth(app);

export default function NavBar() {
  const [isSignedUp, setIsSignedUp] = useState(false);
  // const isLoggedIn = false; // change this based on your auth logic
  const fullName = "Kushagra Sharma"; // from user data

  const signupUser = () => {
    createUserWithEmailAndPassword(
      auth, 
      "swati@gmail.com", 
      "1234@ery"
    ).then((value) => console.log(value));
  };

  const navItems = isSignedUp
    ? [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: fullName, href: "/:id" },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        // { label: "Login", onClick: signupUser },
        { label: "Login", href: "/login" },
        { label: "SignUp", href: "/signup" },
      ];

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
