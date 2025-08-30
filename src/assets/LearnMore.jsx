import React from "react";
import NavBar from "./partials/NavBar";
import { IoMdInformationCircle } from "react-icons/io";
import { IoFlashOutline } from "react-icons/io5";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { FaChartSimple } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdSecurity } from "react-icons/md";
import './LearnMore.css'
import { IoPersonOutline } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa6";
import Footer from "./partials/footer";
import myImg from './Picsart_25-08-28_15-21-20-126.png';

export default function LearnMore(){
return(
<>
<NavBar />
<div className="img">
<img class="image" src={myImg} alt="My edited image" />
</div>
<section className="hero-section">
<p className="hero-text">Record attendance in seconds, automate reporting, and<br/> monitor participation trends — built for educators and administrators<br/> who want to save time and act on data.</p>
</section>


<div className="boxes">
<article className="card whatIs">
<div className="heading">
<IoMdInformationCircle size={24} color="#d9d9e478" className="icon info"/>
<h3 className="title">What is BunkSmart?</h3>
</div>


<div className="content">
<p>BunkSmart is a lightweight attendance management tool built for classrooms, training programs, and workshops. It gives students a clear view of their attendance percentage, sends early warnings before they fall below 75%, and makes reporting and follow-up simple for them.</p>
</div>
</article>


<article className="card CoreFeatures">
<div className="heading">
<IoFlashOutline size={28} color="#eaa330cd" className="icon warning"/>
<h3 className="title">Core Features</h3>
</div>


<div className="feature">
<div className="feature-head">
<TbSquareRoundedPercentage size={26} color="#658d1bfd" className="icon feature-icon"/>
<p className="feature-title" style={{fontSize: "20px"}}>Live Attendance Percentage</p>
</div>


<div className="cf-content">
<p style={{paddingLeft: "40px", marginTop: "-10px"}}>A clear numeric and visual indicator shows current attendance percent for each student. A colored progress bar instantly communicates status.</p>
</div>
</div>

<div className="feature" style={{marginTop: "2rem"}}>
<div className="feature-head">
<FaChartSimple size={26} color="#c9c926fd" className="icon feature-icon"/>
<p className="feature-title" style={{fontSize: "20px"}}>Comprehensive Statistics & Charts</p>
</div>


<div className="cf-content">
<p style={{paddingLeft: "40px", marginTop: "-10px"}}>Deep, easy-to-read analytics provide total completions, current and longest streaks, average performance, and habit reliability scores. Interactive charts (line charts for trends, bar charts for weekly comparisons, and a heatmap calendar for daily intensity) let users zoom into weeks or months, filter by habit or date range, and export CSVs for backup or analysis.</p>
</div>
</div>

<div className="feature" style={{marginTop: "2rem"}}>
<div className="feature-head">
<IoIosNotifications size={26} color="#c95726ca" className="icon feature-icon"/>
<p className="feature-title" style={{fontSize: "20px"}}>Smart Notifications</p>
</div>


<div className="cf-content">
<p style={{paddingLeft: "40px", marginTop: "-10px"}}>smart notifications deliver context-aware nudges: push reminders for missed days, celebratory alerts for streak milestones, and digest summaries of weekly progress. Notifications link straight back to the habit view so users can act immediately.</p>
</div>
</div>


</article>


<article className="Auth">
<div className="heading">
<MdSecurity size={28} color="#30a6eacd" className="icon warning"/>
<h3 className="title">Authentication & Security</h3>
</div>


<div className="feature">
<div className="feature-head">
<IoPersonOutline size={26} color="#658d1bfd" className="icon feature-icon"/>
<p className="feature-title" style={{fontSize: "20px"}}>Multiple Login Options</p>
</div>


<div className="cf-content">
<p style={{paddingLeft: "40px", marginTop: "-10px"}}>Sign up with email/password or use Google OAuth for seamless authentication and account management.</p>
</div>
</div>

<div className="feature" style={{marginTop: "2rem"}}>
<div className="feature-head">
<FaDatabase size={26} color="#c9c926fd" className="icon feature-icon"/>
<p className="feature-title" style={{fontSize: "20px"}}>Secure Data Storage</p>
</div>
<div className="cf-content">
<p style={{paddingLeft: "40px", marginTop: "-10px"}}>All your data is encrypted and stored securely using industry-standard security practices to protect your privacy.</p>
</div>
</div>


</article>
</div>

<Footer/>
</>
)
}