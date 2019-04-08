import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import { Grid, Button } from 'semantic-ui-react'
import Playlist from './components/Playlist'

class App extends Component {

  render() {
    return (
        <Grid className="App" columns={1}>
            <HostNewEvent />
            <Playlist/>
        </Grid>
    );
  }
}

export default App;
