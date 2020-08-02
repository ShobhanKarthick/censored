import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import './Components/Styles.css';
import Home from './Components/Home';
import Play from './Components/Play';
import HowToPlay from './Components/HowToPlay';
import About from './Components/About';
import Upload from './Components/Upload';
import Popup from './Components/Popup';
import Leaderboard from './Components/Leaderboard';
import PlayArcade from './Components/PlayArcade';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/play" exact component={Play} />
      <Route path="/playarcade" exact component={PlayArcade} />
      <Route path="/leaderboard" exact component={Leaderboard} />
      <Route path="/howtoplay" exact component={HowToPlay} />
      <Route path="/about" exact component={About} />
      <Route path="/upload" exact component={Upload} />
      <Route path="/popup" exact component={Popup} />
    </Router>
  );
}

export default App;
