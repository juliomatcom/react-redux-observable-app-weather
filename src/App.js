import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { HomeConnected } from './pages/Home';
import NoMatch from './pages/NoMatch';
import './App.css';

class App extends Component {
  render() {
    return (
       <Router>
        <div className="app">
          <h1>Wheater</h1>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <hr/>
          <Switch>
            <Route exact path="/" component={HomeConnected} />
            <Route exact path="/about" component={() => <p>About page</p>} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
