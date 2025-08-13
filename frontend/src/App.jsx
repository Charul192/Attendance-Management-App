import React from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import BackGround from './assets/partials/background';
import About from './pages/about.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';

function App() {

  return (
    <>
    {/* <BackGround/> */}
     <BrowserRouter>
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
