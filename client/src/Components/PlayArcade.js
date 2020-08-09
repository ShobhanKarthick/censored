import React, { useState, useEffect } from "react";
import { Menu, Close, Timer } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import generateHash from "random-hash";

function Play() {
  const [allCensored, setAllCensored] = useState("");
  const [user, setUser] = useState('')
  const [bestScore, setBestScore] = useState([])
  const [gameScore, setGameScore] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("");
  const [number, setNumber] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [random, setRandom] = useState("");
  const [executed, setExecuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const history = useHistory();
  const shuffleSeed = require("shuffle-seed");
  const humanizeDuration = require("humanize-duration");

  let image, clue;

  useEffect(() => {
    if(localStorage.getItem('name')){
    axios.post("/users/query", {name: localStorage.getItem('name')})
    .then(response => {
        let user = response.data
        setUser(user[0])
        setScore(user[0].score)
        setBestScore(user[0].bestScore)
    })
    .catch(err => console.log(err))
    }
    else{
        history.push("/")
    }

  }, [])

  useEffect(() => {
    document.getElementById("start-up-display").style.display = "flex"
    document.getElementById("bg-overlay").style.display = "block"
    if (!executed) {
      setRandom(generateHash({ length: 7 }));
      setExecuted(true);
      return;
    }
  },[])

  useEffect(() => {
    axios.get("/censored")
    .then((response) => {
      let shuffle = shuffleSeed.shuffle(response.data, random);
      setAllCensored(shuffle);
    })
    .catch(error => console.error(error))
  }, [random, shuffleSeed]);

  if(timer === 180){        
    bestScore.push(gameScore)
    axios.put('/users/update/' + user._id, {bestScore: bestScore})
    console.log(bestScore)
    document.getElementById("time-up-display").style.display = "flex"
    document.getElementById("bg-overlay").style.display = "block"
  }

    useEffect(() => {
      if(timer === 6){
      document.getElementById("hold-on-info").style.display = "block";
      }
      if(timer === 61){
        document.getElementById("hold-on-info").style.display = "block";
      }
      if(timer === 121){
        document.getElementById("hold-on-info").style.display = "block";
      }
      if(timer === 151){
        document.getElementById("hold-on-info").style.display = "block";
      }
      if(timer === 171){
        document.getElementById("hold-on-info").style.display = "block";
      }
      if(timer === 180){
        document.getElementById("timer-field").style.display = "none";
      }
    })

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
        bestScore.push(gameScore)
        console.log(bestScore)
        history.push("/leaderboard");
        axios.put('/users/update/' + user._id, {bestScore: bestScore})
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
      allCensored[number].answer.toUpperCase().replace(/\s/g,'') === userAnswer.toUpperCase().replace(/\s/g,'')
    ) {
      document.getElementById("toast-correct").style.display = "block";
      window.setTimeout(function () {
        document.getElementById("toast-correct").style.display = "none";
      }, 3000);

      setNumber(number + 1);
      setScore(score + 1);
      setUserAnswer("");
      window.scrollTo(0, 100);
      axios.put('/censored/update/'+allCensored[number]._id, {winCount: allCensored[number].winCount+1})
      axios.put('/users/update/' + user._id, {score: (score + 1)})
      .catch(err => console.log(err))
    } else {
      document.getElementById("toast-incorrect").style.display = "block";
      window.setTimeout(function () {
        document.getElementById("toast-incorrect").style.display = "none";
      }, 3000);
    }
  };

  const nextButton = (event) => {
    event.preventDefault()
    setNumber(number + 1);
    setUserAnswer("");
    window.scrollTo(0, 100);
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


  const lastPage = () => {
    if (allCensored[number - 1]) {
      if (number === allCensored.length) {
        // document.getElementById("play-sub-head").style.display = "none";
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
    if (timer < 10) {
      return (
        <React.Fragment>
          Your 3-minute countdown has begun.
          <br /> So, buckle up dude!!!
        </React.Fragment>
      );
    } 
    if (timer > 60 && timer < 119) {
      return (
        <React.Fragment>
          1 minute is up...
          <br /> Come on hurry up!!!
        </React.Fragment>
      );
    }
    if (timer > 120 && timer < 149) {
      return (
        <React.Fragment>
          2 minutes up...
          <br /> Catch up with your friends!!!
        </React.Fragment>
      );
    }
    if (timer > 150 && timer < 169) {
      return (
        <React.Fragment>
        Your final 30 seconds
          <br /> Pull yourself together!!!
        </React.Fragment>
      );
    }
      if (timer > 170) {
        return (
          <React.Fragment>
          Your last 10 seconds
            <br /> Buckle Up!!!
          </React.Fragment>
        );
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
      <div id='hold-on-info' className='hold-on-info'>
        {holdOnInfo()}
      </div>

      <div id='start-up-display' className='time-up-display'>
        <p style={{margin: 0, fontSize: "30px", textAlign: "center", marginBottom: "20px"}}>You have got just 3 minutes !!!</p>
        <p style={{margin: 0, fontSize: "20px", textAlign: "center", marginBottom: "20px"}}>Do as much and top the leaderboard :)</p>
        <div style={{float: "right", padding: "10px", fontSize: "20px"}} onClick={() => {document.getElementById("start-up-display").style.display = "none"; document.getElementById("bg-overlay").style.display = "none"; setTimer(0)}}>Cool</div>
      </div>

      <div id='time-up-display' className='time-up-display'>
        <h1>TIME UP !!!</h1>
        <Timer />
        <div>
        <div className="time-up-buttons" style={{ padding: "10px"}} onClick={() => window.location.reload()} > PLAY AGAIN </div>
        <div className="time-up-buttons">
        
        <Link  style={{ padding: "10px", color: "#046ae6"}} to="/leaderboard"> OHH DAMN! </Link>
        </div>
        </div>
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
        <Link to='/leaderboard'>LEADERBOARD</Link>
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
        }}
      >
        {number === 0 && (
          <h1 style={{textAlign: "center"}} className='play-page-head'>Go to private mode! <br />Censors coming up...</h1>
        )}

        {
          (timer > 169) ?
          <p id="timer-field" style={{backgroundColor: "#ff0000", padding: "10px", borderRadius: "3px", margin: "5px"}}>
          Your last {humanizeDuration(((180 - timer) * 1000),{delimiter: "  "})} 
          </p> :
          <p style={{backgroundColor: "#046ae6", padding: "10px", borderRadius: "3px", margin: "5px"}}>
          {humanizeDuration(((180 - timer) * 1000),{delimiter: "  "})} left
          </p>
        }

        {number < allCensored.length && (
          <h1 className='play-page-head'>Censor #{number + 1 - errorCount}</h1>
        )}

        <h1 id='play-sub-head' className='play-sub-head'>{clue}</h1>

    </div>

    <div className='play-image-container'>
    <img id="blur-image" src={image} alt='pic of the person' onError={handleImageBroken} />
    {
      // <div className='loader' id='loader' />
    }
  </div>

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
          <button id='uncensor' className='answer-button' type='submit'>
            UNCENSOR
          </button>
          {number < allCensored.length && ( <button id='next-arcade-button' className='answer-button' onClick={nextButton} > NEXT </button> )}
          {lastPage()}
        </div>
      </form>
    </div>
  );
}

export default Play;
