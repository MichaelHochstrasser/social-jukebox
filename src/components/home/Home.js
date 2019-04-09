import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, Container, Grid, Header, Input, Message} from "semantic-ui-react";
import {Image} from "semantic-ui-react";
import './Home.css';

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            eventName: '',
            showError: false
        };
    }

    createEvent() {
        const axios = require('axios');

        const url = 'https://us-central1-social-jukebox-zuehlke.cloudfunctions.net/createEvent';
        const body = {
            name: this.state.eventName,
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
                    showError: false
                })

            })
            .catch((error) => {
                console.log(error);
                this.setState({
                  showError: true
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
                            <Header as='h1'>Social Jukebox: {this.state.message}</Header>
                            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
                            {this.renderRedirect()}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            { this.state.showError ? <ErrorMessage message='Error while creating event' /> : null }
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

class ErrorMessage extends Component{
    render() {
        return (
            <Message color='red'>{this.props.message}</Message>
        )
    }
}