import React, { useState, useEffect } from "react";
import { Menu, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    if (localStorage.getItem("name")) {
      document.getElementById("mode-display-head").style.display = "block";
      document.getElementById("mode-display-modes").style.display = "flex";
      document.getElementById("join-form").style.display = "none";
    } else {
      document.getElementById("mode-display").style.paddingBottom = "45px";
      document.getElementById("mode-display-head").style.display = "none";
      document.getElementById("mode-display-modes").style.display = "none";
      document.getElementById("join-form").style.display = "flex";
    }
  });

  const nameHandler = (event) => {
    setName(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    axios
      .post("/users/query", { name: name })
      .then((response) => {
        let user = response.data;
        if (user.length === 0) {
          axios
            .post("/users/add", { name: name })
            .then((user) => {
              console.log("User added succesfully");
              document.getElementById("join-form").style.display = "none";
              document.getElementById("mode-display-head").style.display =
                "block";
              document.getElementById("mode-display-modes").style.display =
                "flex";
              document.getElementById("mode-display").style.paddingBottom =
                "30px";
              localStorage.setItem("name", name);
            })
            .catch((error) => console.log(error));
        } else {
          document.getElementById("join-form-input").placeholder =
            "Name already exists!";
          document
            .getElementById("join-form-input")
            .classList.add("mode-display-input");
        }
      })
      .catch((error) => console.log(error));

    setName("");
  };

  const open = () => {
    document.getElementById("home-nav").style.display = "flex";
  };

  const close = () => {
    document.getElementById("home-nav").style.display = "none";
  };

  const modeChoosing = () => {
    document.getElementById("bg-overlay").style.display = "block";
    document.getElementById("mode-display").style.display = "block";
  };

  const modeClose = () => {
    document.getElementById("bg-overlay").style.display = "none";
    document.getElementById("mode-display").style.display = "none";
  };

  const playDrop = () => {
    if (
      document.getElementById("play-links-arcade").style.display === "block"
    ) {
      document.getElementById("play-links-arcade").style.display = "none";
      document.getElementById("play-links-zen").style.display = "none";
    } else {
      document.getElementById("play-links-arcade").style.display = "block";
      document.getElementById("play-links-zen").style.display = "block";
    }
  };

  return (
    <div className='home'>
      <Menu
        onClick={open}
        style={{
          color: "#ffffff",
          fontSize: "40px",
          alignSelf: "flex-end",
          padding: "35px 40px",
        }}
      />
      <div id='home-nav' className='home-nav'>
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
        <Link to='/howtoplay' style={{ marginTop: "80px" }}>
          HOW TO PLAY
        </Link>
        <Link onClick={playDrop} to='#'>
          PLAY
        </Link>
        <Link
          id='play-links-zen'
          style={{ display: "none", marginLeft: "20px" }}
          to='/play'
        >
          ZEN MODE
        </Link>
        <Link
          id='play-links-arcade'
          style={{ display: "none", marginLeft: "20px" }}
          to='/playarcade'
        >
          ARCADE MODE
        </Link>{" "}
        <Link to='/about'>ABOUT US</Link>
        <Link to='/leaderboard'>LEADERBOARD</Link>
      </div>

      <div className='bg-light-overlay' id='bg-overlay' onClick={modeClose} />
      <div id='mode-display' className='mode-display'>
        <div id='mode-display-head'>Which mode do you want play in ?</div>
        <br />

        <form id='join-form' onSubmit={submitHandler}>
          <input
            id='join-form-input'
            type='text'
            placeholder="What's your name?"
            value={name}
            onChange={nameHandler}
            required
          />
          <button for='join-form' type='submit'>
            JOIN
          </button>
        </form>

        <div id='mode-display-modes'>
          <Link to='/playarcade' onClick={modeClose}>
            {" "}
            Arcade{" "}
          </Link>
          <Link to='/play' onClick={modeClose}>
            {" "}
            Zen
          </Link>
        </div>
      </div>

      <div className='welcome'>
        <h3 className='home-subhead'>WELCOME TO</h3>
        <h1 className='home-head'>
          &nbsp;&nbsp;&nbsp;CENSORED&nbsp;&nbsp;&nbsp;
        </h1>
        <div className='button-container-home'>
          <span className='home-play-button' onClick={modeChoosing}>
            <strong>PLAY</strong>
          </span>
          <Link className='home-howtoplay-button' to='/howtoplay'>
            <strong>HOW TO PLAY</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
