import React, { Component } from 'react';
import './App.css';
import EventInvitation from './components/host/EventInvitation'
import HostNewEvent from './components/host/HostNewEvent'
import Playlist from './components/Playlist'

class App extends Component {

  render() {
    return (
      <div className="App">
        <HostNewEvent />
        <EventInvitation eventName="Sofia's Super Sweet 16" eventLink="https://spotify.com" />

        <Playlist/>
      </div>
    );
  }
}

export default App;
