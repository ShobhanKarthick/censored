import React, { useState, useEffect, useRef } from "react";
import { Menu, Close } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import generateHash from "random-hash";

function Play() {
  const [allCensored, setAllCensored] = useState([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [number, setNumber] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [random, setRandom] = useState("");
  const [executed, setExecuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const checkRef = useRef(null)
  const history = useHistory();
  const shuffleSeed = require("shuffle-seed");

  let image, clue;

  useEffect(() => {
    if (!executed) {
      setRandom(generateHash({ length: 7 }));
      setExecuted(true);
      return;
    }
  }, []);

  useEffect(() => {
    axios
      .get("/censored")
      .then((response) => {
        let results = response.data;
        let shuffle = shuffleSeed.shuffle(results, random);
        setAllCensored(shuffle);
      })
      .catch((error) => console.error(error));
  }, [random, shuffleSeed]);

  useEffect(() => {
    if (
      history.action === "PUSH" ||
      history.action === "POP" ||
      history.action === "REPLACE"
    ) {
    } else {
    }
    return () => {
      if (window.location.pathname === "/") {
        console.log("back");
        history.push("/popup");
      }
    };
  }, [history]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  if (
    document.getElementById("hold-on-info") &&
    document.getElementById("hold-on-info").style.display === "block"
  ) {
    window.setTimeout(function () {
      document.getElementById("hold-on-info").style.display = "none";
    }, 3000);
  }

  const userAnswerHandler = (event) => {
    setUserAnswer(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (
      allCensored[number].answer.toUpperCase().replace(/\s/g, "") ===
      userAnswer.toUpperCase().replace(/\s/g, "")
    ) {
      document.getElementById("toast-correct").style.display = "block";
      window.setTimeout(function () {
        document.getElementById("toast-correct").style.display = "none";
      }, 3000);

      setNumber(number + 1);
      setTimer(0);
      setUserAnswer("");
      window.scrollTo(0, 100);
      axios
        .put("/censored/update/" + allCensored[number]._id, {
          winCount: allCensored[number].winCount + 1,
        })
        .catch((error) => console.log(error));
    } else {
      document.getElementById("toast-incorrect").style.display = "block";
      window.setTimeout(function () {
        document.getElementById("toast-incorrect").style.display = "none";
      }, 3000);
    }
  };

  if (allCensored[number]) {
    image = allCensored[number].link;
    clue = allCensored[number].clue.map((current, index) => {
      if (index === 0) {
        if (
          current.charAt(0) === "A" ||
          current.charAt(0) === "E" ||
          current.charAt(0) === "I" ||
          current.charAt(0) === "O" ||
          current.charAt(0) === "U"
        ) {
          return <span key={index}>{"An " + current }&nbsp;</span>;
        } else {
          return <span key={index}>{"A " + current }&nbsp;</span>;
        }
      }
      if (index === allCensored[number].clue.length - 1) {
        if (
          current.charAt(0) === "A" ||
          current.charAt(0) === "E" ||
          current.charAt(0) === "I" ||
          current.charAt(0) === "O" ||
          current.charAt(0) === "U"
        ) {
          return <span key={index}>&nbsp;{"and an " + current + " "}</span>;
        } else {
          return <span key={index}>&nbsp;{"and a " + current + " "}</span>;
        }
      } else {
        if (
          current.charAt(0) === "A" ||
          current.charAt(0) === "E" ||
          current.charAt(0) === "I" ||
          current.charAt(0) === "O" ||
          current.charAt(0) === "U"
        ) {
          return <span key={index}>{"an " + current + " "}</span>;
        } else {
          return <span key={index}>{"a " + current + " "}</span>;
        }
      }
    });
  }

  const handleImageBroken = () => {
    axios.put("/censored/update/" + allCensored[number]._id, {
      blocked: true,
    });
    setTimer(0);
    setNumber(number + 1);
    setErrorCount(errorCount + 1);
    setUserAnswer("");
    window.scrollTo(0, 100);
  };

  const displayAnswer = (event) => {
    event.preventDefault();
    if (timer > 20) {
      document.getElementById("play-page-answer-head").style.zIndex = "2";
      document.getElementById("blur-image").style.zIndex = "2";
      document.getElementById("blur-image").style.filter = "blur(0px)";
      document.getElementById("play-page-answer-head").style.display = "block";
      document.getElementById("bg-overlay").style.display = "block";
      document.getElementById("next-button").style.display = "block";
      document.getElementById("play-answer-message").style.display = "block";
      document.getElementById('blur-image').scrollIntoView(true);

      axios
        .put("/censored/update/" + allCensored[number]._id, {
          lossCount: allCensored[number].lossCount + 1,
        })
        .catch((error) => console.log(error));
    } else {
      document.getElementById("hold-on-info").style.display = "block";
    }
  };

  const postAnswerDisplay = () => {
    document.getElementById("play-page-answer-head").style.zIndex = "0";
    document.getElementById("blur-image").style.zIndex = "0";
    document.getElementById("play-answer-message").style.display = "none";
    document.getElementById("blur-image").style.filter = "blur(10px)";
    document.getElementById("play-page-answer-head").style.display = "none";
    document.getElementById("bg-overlay").style.display = "none";
    document.getElementById("next-button").style.display = "none";

    setTimer(0);
    setNumber(number + 1);
    setUserAnswer("");
    window.scrollTo(0, 100);
  };

  const lastPage = () => {
    if (allCensored[number - 1]) {
      if (number === allCensored.length) {
        document.getElementById("play-sub-head").style.display = "none";
        document.getElementById("play-image-container").style.display = "none";
        document.getElementById("play-answer").style.display = "none";
        document.getElementById("uncensor").style.display = "none";
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ margin: "20px", color: "#ffffff" }}>
              That's it for now we'll add more!!!
            </h1>
            <div
              to='/play'
              onClick={() => window.location.reload()}
              className='play-again'
            >
              PLAY AGAIN
            </div>
          </div>
        );
      }
    }
  };

  const holdOnInfo = () => {
    if (20 - timer > 0) {
      return (
        <React.Fragment>
          You can see the answer in {20 - timer} secs.
          <br /> So, Hold your horses and think baby!!!
        </React.Fragment>
      );
    } else {
      return <React.Fragment>You can now see the answer !!!</React.Fragment>;
    }
  };

  const open = () => {
    document.getElementById("home-nav").style.display = "flex";
  };

  const close = () => {
    document.getElementById("home-nav").style.display = "none";
  };

  return (
    <div className='play-page'>
      <div
        id='bg-dark-overlay'
        style={{ display: "none", backgroundColor: "#080808" }}
        className='bg-overlay'
      />
      <div id='hold-on-info' className='hold-on-info'>
        {holdOnInfo()}
      </div>
      <div className='head-container'>
        <div style={{ width: "100%", boxSizing: "border-box" }}>
          <h1 id='home-head' className='home-head'>
            <a href='/'>CENSORED</a>
          </h1>
          <p id='sub-head' style={{ width: "fit-content", margin: 0 }}>
            Play
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
        <Link to='/howtoplay'>HOW TO PLAY</Link>
        <Link to='/about'>ABOUT US</Link>
      </div>
      <div className='bg-overlay' id='bg-overlay' />
      <div id='toast-correct' className='toast-correct'>
        Bravo! Your answer is correct
      </div>
      <div id='toast-incorrect' className='toast-incorrect'>
        Sorry! Your answer is wrong
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "80%",
        }}
      >
        {number === 0 && (
          <h1 className='play-page-head'>Let's Uncensor... Shall we ?!</h1>
        )}

        {number < allCensored.length && (
          <h1 className='play-page-head'>Censor #{number + 1 - errorCount}</h1>
          )}

        <h1 id='play-sub-head' className='play-sub-head'>
          {clue}
        </h1>
      </div>
      <h1 className='play-page-head' id="play-answer-message">Uncensored Titan is censoring you for life !</h1>

      <div className='play-image-container'>
          <img id="blur-image" src={image} alt='pic of the person' onError={handleImageBroken} />
          {
            // <div className='loader' id='loader' />
          }
      </div>
      <h1 className='play-page-head' id="play-page-answer-head">The answer is <span style={{color: "#038dea"}}>{allCensored[number] && allCensored[number].answer} </span></h1>
      <button id="next-button" className="answer-button" onClick={postAnswerDisplay}>NEXT</button>

      <form id='play-form' className='play-form' onSubmit={submitHandler}>
        <input
          id='play-answer'
          className='play-answer'
          type='text'
          placeholder='Enter your answer'
          value={userAnswer}
          onChange={userAnswerHandler}
          title='Enter your answer!'
          required
        />
        <div id='button-container' className='button-container'>
          <button id='uncensor' className='answer-button'type='submit'>
            UNCENSOR
          </button>
          {number < allCensored.length && (
            <button
              id='show-answer'
              className='answer-button'
              onClick={displayAnswer}
            >
            SHOW ANSWER
            </button>
          )}
          {lastPage()}
        </div>
      </form>
      <div id="checkRef" />
    </div>
  );
}

export default Play;
