import React from "react";
import './custom.css';

export default function Footer(){
    return(
        <div className="footer">
            <div className="foot-left">
                <p style={{color:"#cfc4c4ff", fontSize:"18px", fontWeight:"750"}}>BunkSmart</p>
                <p style={{color:"#cfc4c4aa"}}>Built with ❤️ for better attendance</p>
            </div>
            <div className="foot-right">
                <a href="https://github.com/Charul192" style={{color:"#cfc4c471"}}>
                    Built by <a href="https://github.com/Charul192" style={{color:"#cfc4c4ff"}}>Charul192</a>
                </a>
            </div>
        </div>
    )
}