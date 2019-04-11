import React, { Component } from 'react';
import {Button, Icon, Table, Header, Image, Message} from 'semantic-ui-react'
import axios from 'axios';

class PlaylistItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sessionId: localStorage.getItem('sessionId'),
            showError: false
        };
        this.handleVote = this.handleVote.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleVote(vote) {
        const url = 'http://localhost:5000/social-jukebox-zuehlke/us-central1/vote';
        const body = {
            songId: this.props.songId,
            eventId: this.props.eventId,
            vote: vote,
            sessionId: this.state.sessionId
        };
        const header = {
            'Content-Type': 'application/json'
        };

        axios.post(url, body, header)
        .then((response) => {
            console.log(response);
            const event = response.data;
            this.setState({showError: false});
            return;
        })
        .catch((error) => {
            console.log(error);
            this.setState({showError: true});
        });
    };

    isAlreadyVoted() {
        for (var i in this.props.voters) {
            if (this.props.voters[i]==this.state.sessionId) {
                return true;
            }
        }
        return false;
    }

    render() {
        return <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src={this.props.image} rounded size='mini' />
                        <Header.Content>
                            {this.props.songtitle}
                            <Header.Subheader>{this.props.artist}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell textAlign='right'>
                    { this.state.showError ? <ErrorMessage message='Error' /> : null }
                    <Button.Group size='mini'>
                        <Button className={this.isAlreadyVoted()? '' : 'basic'} icon color='red' onClick={this.handleVote.bind(this, -1)}><Icon name='thumbs down outline' /></Button>
                        <Button basic color='grey'>{this.props.votes}</Button>
                        <Button className={this.isAlreadyVoted()? '' : 'basic'} icon color='green' onClick={this.handleVote.bind(this, 1)}><Icon name='thumbs up outline' /></Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
    }
}

class ErrorMessage extends Component{
    render() {
        return (
            <Message color='red'>{this.props.message}</Message>
        )
    }
}

export default PlaylistItem;