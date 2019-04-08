import React, { Component } from 'react';
import './App.css';
import EventInvitation from './components/host/EventInvitation'
import HostNewEvent from './components/host/HostNewEvent'
import Playlist from './components/playlist/Playlist'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Container from "semantic-ui-react/dist/es/elements/Container/Container";
import {Playheader} from "./components/playlist/Playheader";
import {PlaySite} from "./components/playlist/PlaySite";

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
            <Route path="/event" component={PlaySite} />
          </Router>
        </div>
    );
  }
}

export default App;
