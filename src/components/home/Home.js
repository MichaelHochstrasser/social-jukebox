import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import PlaylistItem from "../playlist/Playlist";
import {Header} from "semantic-ui-react";
import {Image} from "semantic-ui-react";
import './Home.css';

export class Home extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Events');
    }

    state = {
        redirect: false,
        events: []
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

    onCreateEvent = () => {
        this.setState({
            redirect: true,
            target: '/host'
        })
    }

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

        return <div>
            <h1 className="title">Social Jukebox</h1>
            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
            {this.renderRedirect()}
            <div className="button-container">
                <button className="home-button positive ui button" onClick={this.onCreateEvent}><span className="home-button-text">Create event</span></button>
                <button className="home-button positive ui button" onClick={this.onSearch}><span className="home-button-text">Search & Join event</span></button>
            </div>
            <Header as='h1'>Current Events</Header>
            <ul>
                {this.state.events.map(event =>
                    <li key={event.key}>
                        <Link to={`/event/${event.key}`}>{event.name}</Link>
                    </li>
                )}
            </ul>
        </div>
    }
}