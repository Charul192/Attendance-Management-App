import React from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './assets/home.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import BackGround from './assets/partials/background';

function App() {

  return (
    <>
    {/* <BackGround/> */}
     <BrowserRouter>
    <Routes>
            <Route path="/" element={<Home />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
