import PillNav from './PillNav';
import React from 'react';

export default function NavBar() {
  const isLoggedIn = true; // change this based on your auth logic
  const fullName = "Kushagra Sharma"; // from user data

  const navItems = isLoggedIn
    ? [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: fullName, href: '/:id' }
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' }
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
