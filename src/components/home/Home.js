import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import PlaylistItem from "../playlist/Playlist";
import {Header} from "semantic-ui-react";

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
            {this.renderRedirect()}
            <button onClick={this.onCreateEvent}>Create event</button>
            <button onClick={this.onSearch}>Example Event</button>
            <Header as='h1'>Current Events</Header>
            <ul>
                {this.state.events.map(event => <li key={event.key}><Link to='/event/:id'>{event.name}</Link></li>)}
            </ul>
        </div>
    }
}