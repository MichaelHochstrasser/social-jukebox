import React, { Component } from 'react';
import './App.css';
import HostNewEvent from './components/host/HostNewEvent'
import Startpage from './components/Startpage'
import PlaylistItem from './components/PlaylistItem'
import firebase from "./components/firebase/Firebase";
import { Grid, Button } from 'semantic-ui-react'

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
        <Grid className="App" columns={1}>
            <HostNewEvent />
            <Grid.Row>
                <Grid.Column>
                    Player
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <p>Playlist</p>
                    <PlaylistItem songtitle="Lady Gaga" votes="12"/>
                    <PlaylistItem songtitle="Züri West" votes="11"/>
                    <PlaylistItem songtitle="The Killers" votes="10"/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Button circular color='red' size='big' icon='add' />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

export default App;
