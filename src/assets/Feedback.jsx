import React from "react";
import NavBar from "./partials/NavBar";
import Footer from "./partials/footer";
import { FaRegMessage } from "react-icons/fa6";
import './feedback.css';

export default function Feedback(){
    return(
        <>
        <NavBar />
        <div className="box">
            <div className="heading">
            <div className="icon">
                <FaRegMessage size={32}/>
            </div>
            <div className="heading"><h3>FeedBack</h3>
            </div>
            </div>
            <div className="line"><p>Share your thoughts, report bugs, or suggest improvements</p></div>
        </div>
        <Footer />
        </>
    )
}