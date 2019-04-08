import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import { Grid } from 'semantic-ui-react'
import Playlist from './components/Playlist'

class App extends Component {

  render() {
    return (
        <div>
            <HostNewEvent />
            <Playlist/>
        </div>
    );
  }
}

export default App;
