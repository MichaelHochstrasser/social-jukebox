import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import firebase from "./components/firebase/Firebase";
import { Grid, Button } from 'semantic-ui-react'
import Playlist from './components/Playlist'
import PlaylistItem from "./components/PlaylistItem";

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
