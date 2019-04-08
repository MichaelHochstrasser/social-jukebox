import React, { Component } from 'react';
import './App.css';
import EventInvitation from './components/host/EventInvitation'
import HostNewEvent from './components/host/HostNewEvent'
import Playlist from './components/playlist/Playlist'
import Container from "semantic-ui-react/dist/es/elements/Container/Container";

class App extends Component {

  render() {
    return (
        <div>
            <Container>
                <HostNewEvent />
                <EventInvitation eventName="Sofia's Super Sweet 16" eventLink="https://spotify.com" />

                <Playlist/>
            </Container>
        </div>
    );
  }
}

export default App;
