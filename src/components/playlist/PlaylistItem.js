import React, { Component } from 'react';
import {Button, Icon, Table, Header, Image, Message} from 'semantic-ui-react'
import axios from 'axios';
import VoteButton from './VoteButton';

class PlaylistItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sessionId: 'theVotar',         //ToDo: Add sessionId here
            showError: false,
            voteIsLoading: false
        };
        this.handleVote = this.handleVote.bind(this);
    }

    componentDidMount() {
        //ToDo: Remove Random sessionId
        /*this.timerID = setInterval(
            () => this.randomSession(),
            1000
        );*/
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
        this.setState({
            voteIsLoading: true
        }, this.sendVote.bind(this, vote));
    };

    sendVote(vote) {
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
            this.setState({
                showError: false,
                voteIsLoading: false
            });
            return;
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                showError: true,
                voteIsLoading: false
            });
        });
    }

    isAlreadyVoted() {
        const { voters } = this.props;
        const { sessionId } = this.state;

        return voters.findIndex((voter) => voter === sessionId) !== -1
    }

    render() {
        const { voteIsLoading } = this.state;

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
                        <VoteButton active={this.isAlreadyVoted()} color="red" onClick={this.handleVote.bind(this)} voteValue={-1} disabled={voteIsLoading}>
                            <Icon name='thumbs down outline' />
                        </VoteButton>
                        <Button basic color='grey' disabled={voteIsLoading}>{this.props.votes}</Button>
                        <VoteButton active={this.isAlreadyVoted()} color="green" onClick={this.handleVote.bind(this)} voteValue={1} disabled={voteIsLoading}>
                            <Icon name='thumbs up outline' />
                        </VoteButton>
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