import React from "react";
import NavBar from "./partials/NavBar";
import { IoMdInformationCircle} from "react-icons/io";
import { IoFlashOutline } from "react-icons/io5";
import './LearnMore.css'
import { TbSquareRoundedPercentage } from "react-icons/tb";


export default function LearnMore(){
    return(
        <>
        <NavBar />
        <p style={{fontSize: "1.50rem", fontWeight: "300", marginBottom: "1rem", fontFamily: "Nunito"}}>Record attendance in seconds, automate reporting, and <br/> monitor participation trends — built for educators and administrators<br/> who want to save time and act on data.</p>
        <div className="whatIs">
            <div className="heading">
            <IoMdInformationCircle size={24} color="#314ca5ff"/>
            <p style={{fontSize:"27px"}}>What is BunkSmart?</p>
            </div>
            <div className="content">
            <p>BunkSmart is a lightweight attendance management tool built for classrooms, training programs, and workshops. It gives students a clear view of their attendance percentage, sends early warnings before they fall below 75%, and makes reporting and follow-up simple for them.</p>
            </div>
        </div>

        <div className="CoreFeatures">
            <div className="head">
            <IoFlashOutline size={35} color="#bb3d3dff"/>
            <p style={{fontSize: '20px'}}>Core Features</p>
            </div>
            <div className="left">
                <div className="head">
                <TbSquareRoundedPercentage size={30}  color="#5eb8ebff"/>
                <p style={{fontSize: "20px"}}>
                    Live Attendance Percentage</p>
            </div>
            <div className="cf-content">
            <p>A clear numeric and visual indicator shows current attendance percent for each student. A colored progress bar instantly communicates status.</p>
            </div>
            </div>
            <div className="right"></div>
        </div>
        </>
    )
}