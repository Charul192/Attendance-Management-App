import GooeyNav from './GooeyNav';
import './custom.css';
import React from 'react';

// update with your own items
const items = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Login", href: "#" },
  { label: "Register", href: "#" }
];

export default function Navbar() {
  return (
<div style={{ height: '600px', position: 'relative' }}>
  <GooeyNav
    items={items}
    particleCount={15}
    particleDistances={[90, 10]}
    particleR={100}
    initialActiveIndex={0}
    animationTime={600}
    timeVariance={300}
    colors={[1, 2, 3, 1, 2, 3, 1, 4]}
  />
</div>
)
}