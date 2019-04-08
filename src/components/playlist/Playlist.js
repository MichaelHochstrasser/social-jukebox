import React, { Component } from 'react';
import {Grid, Button, Modal, Table, Image, Header, Icon} from 'semantic-ui-react'
import PlaylistItem from "./PlaylistItem";
import firebase from "../firebase/Firebase";
import {SearchSongs} from "../SearchSongs";

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
                        <Table basic='very'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.state.songs.map(song => <PlaylistItem key={song.key} votes={song.votes} songtitle={song.song} artist={'Artist'}></PlaylistItem>)}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Modal trigger={ <Button circular color='red' size='big' icon='add' />}>
                            <Modal.Header>Search for a song to add</Modal.Header>
                            <Modal.Content image>
                                <Modal.Description>
                                    <SearchSongs/>
                                </Modal.Description>
                            </Modal.Content>
                        </Modal>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
    }
}

export default Playlist;