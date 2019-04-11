import React, { Component } from 'react';
import './App.css';
import EventInvitation from './components/host/EventInvitation'
import HostNewEvent from './components/host/HostNewEvent'
import {PlaySite} from "./components/playlist/PlaySite";
import {FindEvent} from "./components/event/FindEvent";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {Home} from "./components/home/Home";
import {Login} from "./components/login/Login";
import {SettingEvent} from "./components/event/SettingEvent";

class App extends Component {

  render() {
    return (

        <div>
          <Router>
            <Route exact path="/" component={Home} />
            <Route exact path="/host" component={HostNewEvent} />
            <Route exact path="/host/event" render={ (props) => <EventInvitation {...props} eventName="Sofia's Super Sweet 16" eventLink="https://spotify.com" /> } />
            <Route exact path="/event" component={FindEvent} />
            <Route exact path="/event/:id" component={PlaySite} />
            <Route exact path="/event/:id/setting" component={SettingEvent} />
            <Route exact path="/login" component={Login} />
          </Router>
        </div>
    );
  }
}

export default App;
