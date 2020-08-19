import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [clue, setClue] = useState([]);
  const [answer, setAnswer] = useState("");
  const [link, setLink] = useState("");

  const clueHandler = () => {
    let tags = document.getElementsByClassName("upload-tag-input")
    let array = [].slice.call(tags)
    let filteredArray = array.filter((current) => {
      return current.checked === true
    }).map((single) => {
      return single.value
    })
    setClue(filteredArray);
    console.log(filteredArray)
  };

  const answerHandler = (event) => {
    setAnswer(event.target.value);
  };

  const linkHandler = (event) => {
    setLink(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let censor = {
      clue: clue,
      answer: answer,
      link: link,
    };

    axios
      .post("/censored/add", censor)
      .then((censor) => {
        console.log("Censor added");
        alert("Censor Uploaded successfully");
      })
      .catch((err) => {
        console.log(err);
        console.log("Censor was not added");
        alert("Tell Shobhan its not working!!!");
      });

    document.getElementById("Scientist").checked = false
    document.getElementById("Inventor").checked = false
    document.getElementById("Entrepreneur").checked = false
    document.getElementById("Economist").checked = false
    document.getElementById("Footballer").checked = false
    document.getElementById("Cricketer").checked = false
    document.getElementById("Basketballer").checked = false
    document.getElementById("ChessPlayer ").checked = false
    document.getElementById("Celebrity").checked = false
    document.getElementById("Humanitarian").checked = false
    document.getElementById("Authors").checked = false
    document.getElementById("HistoricalFigure").checked = false
    document.getElementById("Magician").checked = false
    document.getElementById("Youtuber").checked = false
    document.getElementById("Singer").checked = false
    document.getElementById("Rapper").checked = false
    document.getElementById("UnderworldDon ").checked = false
    
    setClue([]);
    setAnswer("");
    setLink("");
  };

  return (
    <div className='upload-page'>
      <h1 className='upload-head'>Upload the Censor</h1>
      <form className='upload-form' id='upload-form' onSubmit={submitHandler}>
      <fieldset className="upload-tags-container">
        <legend><p>Tags</p></legend>
        <div><input id="Scientist" className='upload-tag-input' type='checkbox' value="Scientist" onChange={clueHandler} /><label className="upload-input-label" for="Scientist">Scientist</label></div>
        <div><input id="Inventor" className='upload-tag-input' type='checkbox' value="Inventor" onChange={clueHandler} /><label className="upload-input-label" for="Inventor">Inventor</label></div>
        <div><input id="Entrepreneur" className='upload-tag-input' type='checkbox' value="Entrepreneur" onChange={clueHandler} /><label className="upload-input-label" for="Entrepreneur">Entrepreneur</label></div>
        <div><input id="Economist" className='upload-tag-input' type='checkbox' value="Basketballer" onChange={clueHandler} /><label className="upload-input-label" for="Basketballer">Basketballer</label></div>
        <div><input id="Footballer" className='upload-tag-input' type='checkbox' value="Footballer" onChange={clueHandler} /><label className="upload-input-label" for="Footballer">Footballer</label></div>
        <div><input id="Cricketer" className='upload-tag-input' type='checkbox' value="Cricketer" onChange={clueHandler} /><label className="upload-input-label" for="Cricketer">Cricketer</label></div>
        <div><input id="Basketballer" className='upload-tag-input' type='checkbox' value="Economist" onChange={clueHandler} /><label className="upload-input-label" for="Economist">Economist</label></div>
        <div><input id="ChessPlayer" className='upload-tag-input' type='checkbox' value="Chess Player" onChange={clueHandler} /><label className="upload-input-label" for="Chess Player">Chess Player</label></div>
        <div><input id="Celebrity" className='upload-tag-input' type='checkbox' value="Celebrity" onChange={clueHandler} /><label className="upload-input-label" for="Celebrity">Celebrity</label></div>
        <div><input id="Humanitarian" className='upload-tag-input' type='checkbox' value="Humanitarian" onChange={clueHandler} /><label className="upload-input-label" for="Humanitarian">Humanitarian</label></div>
        <div><input id="Authors" className='upload-tag-input' type='checkbox' value="Authors" onChange={clueHandler} /><label className="upload-input-label" for="Authors">Authors</label></div>
        <div><input id="HistoricalFigure" className='upload-tag-input' type='checkbox' value="Historical Figure" onChange={clueHandler} /><label className="upload-input-label" for="Historical Figure">Historical Figure</label></div>
        <div><input id="Magician" className='upload-tag-input' type='checkbox' value="Magician" onChange={clueHandler} /><label className="upload-input-label" for="Magician">Magician</label></div>
        <div><input id="Youtuber" className='upload-tag-input' type='checkbox' value="Youtuber" onChange={clueHandler} /><label className="upload-input-label" for="Youtuber">Youtuber</label></div>
        <div><input id="Singer" className='upload-tag-input' type='checkbox' value="Singer" onChange={clueHandler} /><label className="upload-input-label" for="Singer">Singer</label></div>
        <div><input id="Rapper" className='upload-tag-input' type='checkbox' value="Rapper" onChange={clueHandler} /><label className="upload-input-label" for="Rapper">Rapper</label></div>
        <div><input id="UnderworldDon" className='upload-tag-input' type='checkbox' value="Underworld Don" onChange={clueHandler} /><label className="upload-input-label" for="Underworld Don">Underworld Don</label></div>
        </fieldset>
      <input
          style={{ marginBottom: "20px" }}
          id='answer-input'
          className='upload-input'
          type='text'
          value={answer}
          onChange={answerHandler}
          placeholder='Enter the answer'
          required
        />
        <input
          className='upload-input'
          type='text'
          placeholder='Enter the link for the image'
          value={link}
          onChange={linkHandler}
          required
        />
        <button className='upload-button' for='upload-form' type='submit'>
          UPLOAD
        </button>
      </form>
    </div>
  );
}

export default Upload;
