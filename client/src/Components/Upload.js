import React, { useState } from "react";
import axios from "axios";
import { Add, Close } from "@material-ui/icons";

function Upload() {
  const [clue, setClue] = useState('');
  const [answer, setAnswer] = useState('');
  const [links, setLinks] = useState([""]);

  const add = () => {
    setLinks([...links, ""]);
    console.log(links);
  };

  const remove = (current) => {
    let list = [...links];
    let filter = list.filter((x) => {
      return x !== current;
    });
    console.log(filter);
    setLinks(filter);
  };

  const clueHandler = (event) => {
    setClue(event.target.value);
  };

  const answerHandler = (event) => {
    setAnswer(event.target.value);
  };

  const linksHandler = (event, index) => {
    let linksArray = [...links];
    linksArray[index] = event.target.value;
    setLinks(linksArray);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    let connexion = {
      clue: clue,
      answer: answer,
      links: links,
    };

    axios
      .post("/connexions/add", connexion)
      .then((connexion) => {
        console.log("Connexion added");
        alert("Connexions Uploaded successfully");
      })
      .catch((err) => {
        console.log(err);
        console.log("Connexion was not added");
        alert("Tell Shobhan its not working!!!");
      });

    setClue("");
    setAnswer("");
    setLinks([""]);
  };

  return (
    <div className='upload-page'>
      <h1 className='upload-head'>Upload the connexion</h1>
      <form className='upload-form' id='upload-form' onSubmit={submitHandler}>
        <select
        style={{ marginBottom: "20px" }}
        id='clue-input'
        className='upload-input'
        value={clue}
        onChange={clueHandler}
        required
        >
        <option className="upload-input-option" style={{display: "none"}} value="" selected>Enter the clue</option>
        <option className="upload-input-option" value="Movies">Movies</option>
        <option className="upload-input-option" value="TV Series">TV Series</option>
        <option className="upload-input-option" value="Cartoons">Cartoons</option>
        <option className="upload-input-option" value="Cities">Cities</option>
        <option className="upload-input-option" value="Books">Books</option>
        <option className="upload-input-option" value="Celebrities">Games</option>
        </select>
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

        {links.map((current, index) => {
          return (
            <div className='links-input-container' key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <input
                  className='upload-input'
                  type='text'
                  placeholder={"Enter the link for the image " + (index + 1)}
                  value={current}
                  onChange={(event) => linksHandler(event, index)}
                  required
                />
                {links.length !== 1 && (
                  <Close
                    style={{ fontSize: "35px" }}
                    className='remove-button'
                    id='remove-button'
                    onClick={() => remove(current)}
                  />
                )}
              </div>
              {links.length - 1 === index && links.length - 1 !== 7 && (
                <Add
                  style={{ fontSize: "35px" }}
                  className='add-button'
                  onClick={add}
                />
              )}
            </div>
          );
        })}
        <button className='upload-button' for='upload-form' type='submit'>
          UPLOAD
        </button>
      </form>
    </div>
  );
}

export default Upload;
