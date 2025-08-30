import React from "react";
import { GoGoal } from "react-icons/go";
import "./NeedToKnow.css";
import { FaFire } from "react-icons/fa";
import { BsFillFileBarGraphFill } from "react-icons/bs";
import { TiTickOutline } from "react-icons/ti";
import { IoIosAlarm } from "react-icons/io";
import { PiStarFourFill } from "react-icons/pi";

export default function NeedToKnow() {
  return (
    <>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "40px", margin:"2rem" }}>
        Everything You Need To Know
      </p>
      <div className="features">
        <div className="left">
          <div className="att">
            <div className="head">
              <GoGoal
                color="#4444eeff"
                size="30"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ transition: "0.3s ease" }}
              />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
                Attendance Tracking
              </p>
            </div>
            <div className="data">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                Easily monitor your attendance with clear percentage indicators,
                so you always know whether you’re above or below the 75%
                threshold.
              </p>
            </div>
          </div>
          <div className="alerts">
            <div className="head">
              <FaFire color="#ee9c44b8" size="30" />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
                Smart Alerts
              </p>
            </div>
            <div className="data">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                Get instant alerts when your attendance is close to falling
                below the required percentage, helping you stay on track without
                last-minute panic.
              </p>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="analytics">
            <div className="head">
              <BsFillFileBarGraphFill color="#b2ee44ff" size="30" />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
                Visual Analytics
              </p>
            </div>
            <div className="data">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                Beautiful charts and graphs give you a quick snapshot of your
                attendance trends, subject-wise breakdowns, and performance over
                time.
              </p>
            </div>
          </div>
          <div className="goal">
            <div className="head">
              <TiTickOutline color="#ba50e8ff" size="36" />
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
                Goal Setting
              </p>
            </div>
            <div className="data">
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                Set attendance goals per subject, and get progress updates to
                ensure you never cross the danger zone.
              </p>
            </div>
          </div>
        </div>
        <div className="remainders">
          <div className="head">
            <IoIosAlarm color="#50cce8ff" size="36"/>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
                Reminders
              </p>
          </div>
          <div className="data">
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                Stay ahead of your schedule with reminders designed to keep you consistent. Get notified when your attendance is slipping close to the danger zone. With smart notifications, you can maintain your attendance effortlessly without the stress of last-minute surprises.
              </p>
          </div>
        </div>
        {/* <div className="pic">
          <img
            src="src\assets\partials\Screenshot 2025-08-25 225313.png"
            style={{ borderRadius: "20px" }}
          />
        </div> */}
      </div>
      <div className="protip">
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "28px" }}>
              <PiStarFourFill style={{color: "gold", marginRight: "10px"}}/>
              Pro Tip
              </p>
              <p style={{ fontFamily: "Pacifico", fontSize: "18px" }}>
                Stay ahead of your schedule with reminders designed to keep you consistent. Get notified when your attendance is slipping close to the danger zone. With smart notifications, you can maintain your attendance effortlessly without the stress of last-minute surprises.
              </p>
      </div>
    </>
  );
}
