import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import {NowPlaying} from "./NowPlaying";
import Playlist from "./Playlist";
import firebase from "../firebase/Firebase";
import {MenuBasic} from "../menu/MenuBasic";

export class PlaySite extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Songs');
        this.eventDb = firebase.firestore().collection('Events');

        this.updateSongs = this.updateSongs.bind(this);

        this.state = {
            event: null,
            songs: [],
            isModalOpen: false
        };
    }

    openModal() {
        this.setState({isModalOpen: true});
    }

    closeModal() {
        this.setState({isModalOpen: false});
    }

    updatePlaylist() {
        this.updateSongs();
    }

    componentDidMount() {
        this.updatePlaylist();
        this.loadEvent();
    }

    updateSongs() {
        let eventId = this.props.match.params.id;
        this.db.where("eventId", "==", eventId)
            .orderBy('voteCount', 'desc')
            .orderBy('dateAdded', 'desc')
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

    loadEvent() {
        let eventId = this.props.match.params.id;
        this.eventDb.doc(eventId)
        .get()
        .then(eventDoc => {
            if (eventDoc.exists) {
                this.setState({
                    event: eventDoc.data().name
                })
            } else {
                console.log('Event not found!');
            }
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    render() {
        let eventId = this.props.match.params.id;
        const { event } = this.state;
        return <div>
            <MenuBasic eventId={eventId} />
            <Container>
                <NowPlaying eventId={eventId} />
                { event && <h1>{event}</h1> }
                <Playlist eventId={this.props.match.params.id} closeModal={this.closeModal.bind(this)} openModal={this.openModal.bind(this)} isModalOpen={this.state.isModalOpen} songs={this.state.songs} updatePlaylist={this.updatePlaylist()} />
            </Container>
        </div>
    }
}