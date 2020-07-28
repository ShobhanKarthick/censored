import React from 'react'
import { Instagram, Close, } from "@material-ui/icons";
import { useHistory } from "react-router-dom"

function Popup() {
    
    const history = useHistory()
    const closePopup = () => {
        history.push("/")
    }
      

    return (
        <div className="play-popup-container">
        <div id="play-popup" className="play-popup">
        <Close onClick={closePopup} style={{float: "right", color: "#ffffff", paddingBottom: "10px"}} /><br />
          <h1> Stay tuned for updates !</h1>
          <p>
            FOLLOW US ON {" "}
            <a
              className='icons'
              href='https://www.instagram.com/insti_connexions/'
            >
              <span style={{display: "flex", justifyContent: "center", alignItems: "center", color: "#ffffff"}}><Instagram /> &nbsp; @insti_connexions</span> 
            </a>
          </p>
        </div>
        </div>
    )
}

export default Popup
