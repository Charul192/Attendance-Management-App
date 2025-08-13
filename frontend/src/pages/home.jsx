import Navbar from '../assets/partials/NavBar'; // Ensure exact filename case
import Logo from '../assets/partials/Logo';
import React from 'react';
import Tag from '../assets/partials/tag';

export default function Home() {
  return (
    <>
      <Navbar />
      <Logo/>
      <Tag/>
    </>
  );
}
