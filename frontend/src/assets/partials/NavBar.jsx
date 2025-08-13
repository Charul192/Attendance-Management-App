import GooeyNav from './GooeyNav';
import './custom.css';
import React from 'react';

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
<div style={{ height: '600px', position: 'relative' }}>
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