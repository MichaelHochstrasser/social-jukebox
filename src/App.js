import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import Startpage from './components/Startpage'
import PlaylistItem from './components/PlaylistItem'

class App extends Component {
  render() {
    return (
      <div className="App">
        <HostNewEvent />

        <Startpage name="Lea" />
        <div className="ui container">
            <div className="ui segments">
                <div className="ui segment">Player</div>
                <div className="ui segment">
                  <p>Playlist</p>
                  <PlaylistItem songtitle="Lady Gaga" votes="12"/>
                  <PlaylistItem songtitle="Züri West" votes="11"/>
                  <PlaylistItem songtitle="The Killers" votes="10"/>
                </div>
                <div className="ui segment">Add</div>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
