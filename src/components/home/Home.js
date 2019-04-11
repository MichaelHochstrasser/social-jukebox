import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, Container, Grid, Header, Input, Message} from "semantic-ui-react";
import {Image} from "semantic-ui-react";
import './Home.css';
import classNames from 'classnames';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            eventName: '',
            showError: false,
            disabledClasses: classNames({disabled: false}),
            grind: '',
            userId: ''
        };

        this.onSignIn = this.onSignIn.bind(this);
        this.onSignOut = this.onSignOut.bind(this);
    }

    componentDidMount() {
        window.gapi.signin2.render(
            "googleLogin",
            {
                onsuccess: this.onSignIn,
            },
        );
    }

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };

    onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        console.log('sub: ' + this.parseJwt(googleUser.getAuthResponse().id_token).sub); // This is null if the 'email' scope is not present.
        localStorage.setItem('userId', this.parseJwt(googleUser.getAuthResponse().id_token).sub)
        this.setState({grind: profile.getImageUrl(), userId: localStorage.getItem('userId') });
    }

    onSignOut() {

    }

    createEvent() {
        this.setState({disabledClasses: classNames({loading: true, disabled: true})});

        const axios = require('axios');

        const url = 'http://localhost:5000/social-jukebox-zuehlke/us-central1/createEvent';
        const body = {
            name: this.state.eventName,
            userId: localStorage.getItem('userId')
        };
        const header = {
            'Content-Type': 'application/json'
        };

        axios.post(url, body, header)
            .then((response) => {
                console.log(response);
                this.setState({
                    redirect: true,
                    target: `/event/${response.data.eventId}/setting`,
                    showError: false,
                    disabledClasses: classNames({disabled: false})
                })

            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    showError: true,
                    disabledClasses: classNames({disabled: false})
                })
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
            <div className="button-container">
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Header as='h1'>Social Jukebox {this.state.message}</Header>
                            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
                            {this.renderRedirect()}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <div textAlign="center" id="googleLogin"></div>
                            <img src={this.state.grind}/>
                        </Grid.Column>
                    </Grid.Row>
                    {localStorage.getItem('userId')? <Grid.Row>
                        <Grid.Column textAlign='center'>
                            { this.state.showError ? <ErrorMessage message='Error while creating event' /> : null }
                            <Input size='massive' icon='music' iconPosition='left' placeholder='Eventname' value={this.state.eventName} onChange={this.updateInputValue}/>
                            <Button className={this.state.disabledClasses} id='btnCreateEvent' size='massive' color='green' onClick={this.createEvent.bind(this)}>Create</Button>
                        </Grid.Column>
                    </Grid.Row> : <Grid.Row><Grid.Column textAlign='center'><Message color='orange'>Please Log in to create an Event</Message></Grid.Column></Grid.Row>}
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

class ErrorMessage extends Component{
    render() {
        return (
            <Message color='red'>{this.props.message}</Message>
        )
    }
}