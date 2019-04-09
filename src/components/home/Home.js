import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import PlaylistItem from "../playlist/Playlist";
import {Button, Container, Grid, Header, Input} from "semantic-ui-react";
import {Image} from "semantic-ui-react";
import './Home.css';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            eventName: ''
        };
    }

    createEvent() {
        const axios = require('axios');

        const url = 'https://us-central1-social-jukebox-zuehlke.cloudfunctions.net/createEvent';
        const body = {
            nameAttribute: this.state.eventName,
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

    onSearch = () => {
        this.setState({
            redirect: true,
            target: '/event'
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.target} />
        }
    }

    updateInputValue = (evt) => {
        this.setState({
            eventName: evt.target.value
        });
    }

    render() {

        return <Container>
            <h1 className="title">New Event {this.state.eventName}</h1>
            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
            {this.renderRedirect()}
            <div className="button-container">
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Input size='massive' icon='music' iconPosition='left' placeholder='Eventname' value={this.state.eventName} onChange={this.updateInputValue}/>
                            <Button size='massive' color='green' onClick={this.createEvent.bind(this)}>Create</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <p>or</p>
                            <Link to={'/event'}>Choose an existing event</Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </Container>
    }
}