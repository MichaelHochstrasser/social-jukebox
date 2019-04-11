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

        this.updateSongs = this.updateSongs.bind(this);
        this.setSessionId();

        this.state = {
            songs: [],
            isModalOpen: false,
            sessionId: ''
        };
    }

    setSessionId() {
        if (localStorage.getItem('sessionId')==null) {
            localStorage.setItem('sessionId', this.randomSession());
        }
        this.setState({'sessionId': localStorage.getItem('sessionId')});
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

    randomSession() {
        const min = 10000;
        const max = 10000000000000000;
        const rand = Math.round(min + Math.random() * (max - min));
        return rand;
    }

    render() {
        let eventId = this.props.match.params.id;
        return <div>
            <MenuBasic eventId={eventId} />
            <Container>
                <NowPlaying eventId={eventId} />
                <div>{this.state.sessionId}</div>
                <Playlist eventId={this.props.match.params.id} closeModal={this.closeModal.bind(this)} openModal={this.openModal.bind(this)} isModalOpen={this.state.isModalOpen} songs={this.state.songs} updatePlaylist={this.updatePlaylist()} />
            </Container>
        </div>
    }
}