import React from "react";
import { useNavigate } from 'react-router-dom';
import './custom.css';

export default function Ready(){
    const navigate = useNavigate();
    return(
        <>
            <div className="ready">
                <p style={{paddingTop:"60px", fontSize:"40px"}}>Ready to Transform Your Life?</p>
                <p style={{fontSize:"19px"}}>Transform your life with small daily actions. Join thousands already building better habits today.</p>
                <br/>
                <button onClick={() => navigate('/SignUp')}>Get Started Now</button>
            </div>
        </>
    )
}