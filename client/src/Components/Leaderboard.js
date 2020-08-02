import React, { useState, useEffect } from "react";
import { Menu, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";

function Leaderboard() {

    const [topPlayers, setTopPlayers] = useState([])

    useEffect(() => {
        axios.get("/users/topten")
        .then(response => {
            setTopPlayers(response.data)
            console.log(response.data)
        })
    },[])

  const open = () => {
    document.getElementById("home-nav").style.display = "flex";
  };

  const close = () => {
    document.getElementById("home-nav").style.display = "none";
  };

    return (
        <div className="leaderboard-page">
        <div className='head-container'>
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <h1 id='home-head' className='home-head'>
            <a href='/'>CENSORED</a>
          </h1>
          <p id='sub-head' style={{ width: "fit-content", margin: 0 }}>
            Leaderboard
          </p>
        </div>
        <Menu onClick={open} style={{ color: "#ffffff", fontSize: "40px" }} />
      </div>
      <div id='home-nav' className='home-nav'>
        <Close
          onClick={close}
          style={{ color: "#ffffff", fontSize: "40px", alignSelf: "flex-end" }}
        />
        <Link to='/'>HOME</Link>
        <Link to='/play'>PLAY</Link>
        <Link to='/about'>ABOUT US</Link>
        <Link to='/leaderboard'>LEADERBOARD</Link>
      </div>

      <div className="table-container">
      <h1>Top 10 Censorers</h1>
        <table className="leaderboard-table">
            <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
            {
                topPlayers.map((current, index) => {
                    return(
                        <tr>
                            <td>{index +1}</td>
                            <td>{current.name.charAt(0).toUpperCase() + current.name.slice(1)}</td>
                            <td>{current.score}</td>
                        </tr>
                    )
                })

            }
        </table>
      </div>
        </div>
    )
}

export default Leaderboard
