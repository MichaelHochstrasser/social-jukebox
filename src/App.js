import React, { Component } from 'react';
import './App.css';
import EventInvitation from './components/host/EventInvitation'
import HostNewEvent from './components/host/HostNewEvent'
import Playlist from './components/Playlist'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Container from "semantic-ui-react/dist/es/elements/Container/Container";

class App extends Component {

  render() {
    return (

        <div>
          <Router>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/host">Host Event</Link></li>
              <li><Link to="/host/event">Invite To Event</Link></li>
              <li><Link to="/event">Go To Event</Link></li>
            </ul>

            <Route exact path="/" component={HostNewEvent} />
            <Route exact path="/host" component={HostNewEvent} />
            <Route exact path="/host/event" render={ (props) => <EventInvitation {...props} eventName="Sofia's Super Sweet 16" eventLink="https://spotify.com" /> } />
            <Route path="/event" component={Playlist} />
          </Router>
        </div>
    );
  }
}

export default App;
