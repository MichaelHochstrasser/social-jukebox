import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import {Playheader} from "./Playheader";
import Playlist from "./Playlist";
import firebase from "../firebase/Firebase";

export class PlaySite extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Songs');

        this.updateSongs = this.updateSongs.bind(this);

        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        this.updateSongs();
    }

    updateSongs() {
        let eventId = this.props.match.params.id;
        this.db.where("eventId", "==", eventId)
            .get()
            .then(querySnapshot => {
                let songs = [];
                querySnapshot.forEach(doc => songs.push(doc.data()));
                this.setState({songs: songs});
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }

    render() {
        return <Container>
            <Playheader/>
            <Playlist songs={this.state.songs} />
        </Container>
    }
}