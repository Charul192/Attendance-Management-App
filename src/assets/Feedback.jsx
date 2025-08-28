import React from "react";
import NavBar from "./partials/NavBar";
import Footer from "./partials/footer";
import { FaRegMessage } from "react-icons/fa6";
import "./feedback.css";
import { BiSolidMessageRounded } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { FaBug } from "react-icons/fa6";
import { FaLightbulb } from "react-icons/fa";
import { TiFlash } from "react-icons/ti";

export default function Feedback() {
  return (
    <>
      <NavBar />
      <div className="feedback">
        <div className="box">
          <div className="heading">
            <div className="icon">
              <FaRegMessage size={32} />
            </div>
            <h3>Feedback</h3>
          </div>

          <div className="line">
            <p>Share your thoughts, report bugs, or suggest improvements</p>
          </div>
          <hr color="#ffffff11" />
          <div className="type">
            <p
              style={{
                textAlign: "left",
                paddingLeft: "30px",
                paddingTop: "30px",
              }}
            >
              Type
            </p>
            <div className="buttons">
              <button>
                <p style={{ size: "42px" }}>
                  <BiSolidMessageRounded color="#ffffff85" />
                  &nbsp;&nbsp; General
                </p>
              </button>
              <button>
                <p style={{ size: "42px" }}>
                  <FaBug color="#14da53ff" />
                  &nbsp;&nbsp;Bug
                </p>
              </button>
              <button>
                <p style={{ size: "42px" }}>
                  <FaLightbulb color="#ecdd3ffa" />
                  &nbsp;&nbsp; Feature
                </p>
              </button>
              <button>
                <p style={{ size: "42px" }}>
                  <TiFlash color="#ec8a3ffa" />
                  &nbsp;Improvement
                </p>
              </button>
            </div>
            <div className="msg">
              <textarea
                class="msg"
                placeholder="Share Your Thoughts..."
              ></textarea>
            </div>
          </div>
          <div className="email">
            <p style={{ marginTop: "40px" }}>Email</p>
            <textarea
              class="email"
              disabled
              id="outlined-disabled"
              label="Disabled"
              defaultValue="Hello World"
            ></textarea>
            <footer
              style={{
                color: "#fdf7f754",
                textAlign: "left",
                marginLeft: "130px",
              }}
            >
              Your email is automatically included
            </footer>
          </div>
          <div className="buttonss">
            <button>CANCEL</button>
            <button>
              {" "}
              <IoIosSend /> SEND
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
