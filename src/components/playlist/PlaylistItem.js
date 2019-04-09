import React, { Component } from 'react';
import { Grid, Button, Icon, Label, Segment, Table, Header, Image } from 'semantic-ui-react'
import { axios } from 'axios'

class PlaylistItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            eventId: 'Il9rNPngcXmEbE5UZaZw',    //ToDo: Add eventId here
            sessionId: 'frontendTest1'          //ToDo: Add sessionId here
        };
    }

    handleVote(vote, songId) {
        const axios = require('axios');

        const url = 'https://us-central1-social-jukebox-zuehlke.cloudfunctions.net/vote';
        const body = {
            songId: songId,
            eventId: this.state.eventId,
            vote: vote,
            sessionId: this.state.sessionId
        };
        const header = {
            'Content-Type': 'application/json'
        };

        axios.post(url, body, header)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    render() {
        return <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src={process.env.PUBLIC_URL + '/images/song2.jpg'} rounded size='mini' />
                        <Header.Content>
                            {this.props.songtitle}
                            <Header.Subheader>{this.props.artist}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell textAlign='right'>
                    <Button.Group size='mini'>
                        <Button icon color='red' onClick={this.handleVote.bind(this, -1, 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6')}><Icon name='thumbs down outline' /></Button>
                        <Button basic color='grey'>{this.props.votes}</Button>
                        <Button icon color='green' onClick={this.handleVote.bind(this, 1, 'spotify:track:6rqhFgbbKwnb9MLmUQDhG6')}><Icon name='thumbs up outline' /></Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
    }
}

export default PlaylistItem;