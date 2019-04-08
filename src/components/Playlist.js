import React, { Component } from 'react';
import {Grid, Button, Modal} from 'semantic-ui-react'
import PlaylistItem from "./PlaylistItem";
import firebase from "./firebase/Firebase";

class Playlist extends Component {
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
            const { song, votes } = doc.data();
            songs.push({
                key: doc.id,
                song: song,
                votes: votes
            });
        });
        this.setState({songs});
    };

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate);
    }
    render() {
        return <Grid className="App" columns={1}>
                <Grid.Row>
                    <Grid.Column>
                        <h2>Playlist</h2>
                        {this.state.songs.map(song => <PlaylistItem key={song.key} votes={song.votes} songtitle={song.song}></PlaylistItem>)}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Modal trigger={ <Button circular color='red' size='big' icon='add' />}>
                            <Modal.Header>Search for a song to add</Modal.Header>
                            <Modal.Content image>
                                <Modal.Description>
                                    <p>search here</p>
                                </Modal.Description>
                            </Modal.Content>
                        </Modal>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
    }
}

export default Playlist;