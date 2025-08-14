import NavBar from './partials/NavBar'; // Ensure exact filename case
import Logo from './partials/Logo';
import React from 'react';
import Tag from './partials/tag';

export default function Home() {
  return (
    <>
      <NavBar />
      <Logo/>
      <Tag/>
    </>
  );
}
