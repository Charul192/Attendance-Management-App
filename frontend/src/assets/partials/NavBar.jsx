import PillNav from './PillNav';
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function NavBar() {
  const { user, loginWithRedirect, isAuthenticated, logout} = useAuth0();
  const isLoggedIn = false; // change this based on your auth logic
  // const fullName = "Kushagra Sharma"; // from user data

  console.log(user);

  const navItems = isAuthenticated
    ? [
        { label: 'Home', href: '/' },
        { label: user.given_name, href: '/' },
        { label: 'Logout' , onClick: () => logout() }
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Login', onClick: () => loginWithRedirect() }
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
