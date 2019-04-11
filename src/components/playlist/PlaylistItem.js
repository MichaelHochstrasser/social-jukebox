import React, { Component } from 'react';
import {Button, Icon, Table, Header, Image, Message} from 'semantic-ui-react'
import axios from 'axios';
import VoteButton from './VoteButton';
import { BACKEND_BASE_URL } from '../../shared/constants';

class PlaylistItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sessionId: localStorage.getItem('sessionId'),
            showError: false,
            voteIsLoading: false
        };
        this.handleVote = this.handleVote.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    handleVote(vote) {
        this.setState({
            voteIsLoading: true
        }, this.sendVote.bind(this, vote));
    };

    sendVote(vote) {
        const url = `${BACKEND_BASE_URL}/vote`;
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
        })
        .catch((error) => {
            console.log(error);
            this.setState({
                showError: true,
                voteIsLoading: false
            });
        });
    }

    isAlreadyUpVoted() {
        const { voters } = this.props;
        const { sessionId } = this.state;

        return voters.findIndex((voter) => voter.sessionId === sessionId && voter.vote === 1) !== -1
    }

    isAlreadyDownVoted() {
        const { voters } = this.props;
        const { sessionId } = this.state;

        return voters.findIndex((voter) => voter.sessionId === sessionId && voter.vote === -1) !== -1
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
                        <VoteButton active={this.isAlreadyDownVoted()} color="red" onClick={this.handleVote.bind(this)} voteValue={-1} disabled={voteIsLoading}>
                            <Icon name='thumbs down outline' />
                        </VoteButton>
                        <Button basic color='grey' disabled={voteIsLoading}>{this.props.votes}</Button>
                        <VoteButton active={this.isAlreadyUpVoted()} color="green" onClick={this.handleVote.bind(this)} voteValue={1} disabled={voteIsLoading}>
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