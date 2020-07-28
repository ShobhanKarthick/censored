import React from "react";
import { Menu, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";

function Home() {
  const open = () => {
    document.getElementById("home-nav").style.display = "flex";
  };

  const close = () => {
    document.getElementById("home-nav").style.display = "none";
  };
  return (
    <div className="home">
      <Menu
        onClick={open}
        style={{
          color: "#ffffff",
          fontSize: "40px",
          alignSelf: "flex-end",
          padding: "35px 40px",
        }}
      />
      <div id="home-nav" className="home-nav">
        <Close
          onClick={close}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "#ffffff",
            fontSize: "40px",
            padding: "35px 40px",
          }}
        />
        <Link to="/howtoplay" style={{ marginTop: "80px" }}>
          HOW TO PLAY
        </Link>
        <Link to="/play">PLAY</Link>
        <Link to="/about">ABOUT US</Link>
      </div>

      <div className="welcome">
        <h3 className="home-subhead">WELCOME TO</h3>
        <h1 className="home-head">&nbsp;&nbsp;&nbsp;CENSORED&nbsp;&nbsp;&nbsp;</h1>
        <div className="button-container-home">
          <Link className="home-play-button" to="/play">
            <strong>PLAY</strong>
          </Link>
          <Link className="home-howtoplay-button" to="/howtoplay">
            <strong>HOW TO PLAY</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
