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

        this.db = firebase.firestore().collection('Events');
    }

    state = {
        redirect: false
    }

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate )
    }

    onUpdate = (querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            const { name } = doc.data();
            events.push({
                key: doc.id,
                name: name
            });
        });
        this.setState({events});
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

    render() {

        return <Container>
            <h1 className="title">Social Jukebox</h1>
            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
            {this.renderRedirect()}
            <div className="button-container">
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Input size='massive' icon='music' iconPosition='left' placeholder='Eventname' action='Create'/>
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