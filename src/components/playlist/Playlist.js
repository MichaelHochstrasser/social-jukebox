import React, { Component } from 'react';
import {Grid, Button, Modal, Table, Image, Header, Icon} from 'semantic-ui-react'
import PlaylistItem from "./PlaylistItem";
import firebase from "../firebase/Firebase";
import {SearchSongs} from "../search/SearchSongs";

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('test');
        this.state = {
            songs: [],
            searching: false
        };
    }

    onUpdate = (querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
            const { song, votes, artist } = doc.data();
            songs.push({
                key: doc.id,
                song: song,
                votes: votes,
                artist: artist
            });
        });
        this.setState({songs});
    };

    openSearchBox = () => this.setState({ searching: true })
    closeSearchBox = () => this.setState({ searching: false })

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate);
    }
    render() {
        return <Grid className="App" columns={1}>
                <Grid.Row>
                    <Grid.Column textAlign='right'>
                        <Modal open={this.state.searching}
                               onClose={this.closeSearchBox}
                               trigger={ <Button onClick={this.openSearchBox} color='red' icon='add' content='Add Song' size='medium' labelPosition='left'/>}>
                            <Modal.Header>Search for a song to add</Modal.Header>
                            <Modal.Content image>
                                <Modal.Description>
                                    <SearchSongs/>
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color="red" onClick={this.closeSearchBox}>Cancel</Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Table basic='very' unstackable>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.state.songs.map(song => <PlaylistItem key={song.key} votes={song.votes} songtitle={song.song} artist={song.artist}></PlaylistItem>)}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            </Grid>;
    }
}

export default Playlist;