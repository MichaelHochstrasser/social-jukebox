import React from 'react';
import {Grid, Button, Modal, Table, Header} from 'semantic-ui-react'
import PlaylistItem from "./PlaylistItem";
import {SearchSongs} from "../search/SearchSongs";

export default (props) => {
    let playlistItems = props.songs.length > 0
        ? props.songs.map(song => <PlaylistItem key={song.songId} eventId={song.eventId} votes={song.voteCount} songtitle={song.title} artist={song.artist}></PlaylistItem>)
        : <Header as='h2'>Duuude, what a lame party… Add some songs!</Header>;

    return <Grid className="App" columns={1}>
            <Grid.Row>
                <Grid.Column textAlign='right'>
                    <Modal trigger={ <Button color='red' icon='add' content='Add Song' size='medium' labelPosition='left'/>}>
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
                            {playlistItems}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
}