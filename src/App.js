import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import './Components/Styles.css';
import Home from './Components/Home';
import Play from './Components/Play';
import HowToPlay from './Components/HowToPlay';
import About from './Components/About';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/play" exact component={Play} />
      <Route path="/howtoplay" exact component={HowToPlay} />
      <Route path="/about" exact component={About} />
    </Router>
  );
}

export default App;
