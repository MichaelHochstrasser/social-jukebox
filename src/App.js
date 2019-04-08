import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import Playlist from './components/Playlist'
import Container from "semantic-ui-react/dist/es/elements/Container/Container";

class App extends Component {

  render() {
    return (
        <div>
            <Container>
                <HostNewEvent />
                <Playlist/>
            </Container>
        </div>
    );
  }
}

export default App;
