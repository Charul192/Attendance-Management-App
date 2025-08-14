import PillNav from './PillNav';
// import Logo from './ChatGPT-Image-Aug-14_-2025_-10_11_33-PM.svg';
import React from 'react';

export default function NavBar() {
  return (
    <PillNav
      items={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' }
      ]}
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
