import GooeyNav from './GooeyNav';
import './custom.css';
import React from 'react';
import Logo from './Logo';

// update with your own items
const items = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" }
];  

// Find index of the current path in items
  const activeIndex = items.findIndex(item => item.href === location.pathname);

export default function Navbar() {  
  return (
    
<div style={{
    height: '100px',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    background: '#242424', // <-- black background
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  }}>
  <Logo />  
  <GooeyNav
    items={items}
    particleCount={15}
    particleDistances={[90, 10]}  
    particleR={100}
    initialActiveIndex={activeIndex === -1 ? 0 : activeIndex}
    animationTime={600}
    timeVariance={300}
    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
  />
  
</div>

)
}