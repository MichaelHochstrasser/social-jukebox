import React, { Component } from 'react';
import './App.css';
import Startpage from './components/Startpage'
import PlaylistItem from './components/PlaylistItem'
import firebase from "./components/firebase/Firebase";

class App extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('test');
        this.state = {
            songs: []
        };
    }

    onUpdate = (querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
            const { song } = doc.data();
            songs.push({
                key: doc.id,
                song: song
            });
        });
        this.setState({songs});
    };

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate);
    }

  render() {
    return (
      <div className="App">
        <Startpage name="Lea" />
        <div className="ui container">
            <div className="ui segments">
                <div className="ui segment">Player</div>
                <div className="ui segment">
                  <p>Playlist</p>
                    {this.state.songs.map(song => <PlaylistItem key={song.key} votes="11" songtitle={song.song}></PlaylistItem>)}
                </div>
                <div className="ui segment">Add</div>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
