import Navbar from './partials/NavBar'; // Ensure exact filename case
import Logo from './partials/Logo';
import React from 'react';
import Tag from './partials/tag';

export default function Home() {
  return (
    <>
      <Navbar />
      <Logo/>
      <Tag/>
    </>
  );
}
