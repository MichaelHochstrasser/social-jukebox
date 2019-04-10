import React, { Component } from 'react';
import {Button, Icon, Table, Header, Image, Message} from 'semantic-ui-react'
import axios from 'axios';

class PlaylistItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sessionId: 1,         //ToDo: Add sessionId here
            showError: false
        };
        this.handleVote = this.handleVote.bind(this);
    }

    componentDidMount() {
        //ToDo: Remove Random sessionId
        this.timerID = setInterval(
            () => this.randomSession(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    randomSession() {
        const min = 1;
        const max = 1000;
        const rand = Math.round(min + Math.random() * (max - min));
        this.setState({ sessionId: rand });
    }

    handleVote(vote) {
        const url = 'https://us-central1-social-jukebox-zuehlke.cloudfunctions.net/vote';
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
                    { this.state.showError ? <ErrorMessage message='Error' /> : null }
                    <Button.Group size='mini'>
                        <Button basic icon color='red' onClick={this.handleVote.bind(this, -1)}><Icon name='thumbs down outline' /></Button>
                        <Button basic color='grey'>{this.props.votes}</Button>
                        <Button basic icon color='green' onClick={this.handleVote.bind(this, 1)}><Icon name='thumbs up outline' /></Button>
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