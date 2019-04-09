import React, { Component } from 'react';
import {Container} from "semantic-ui-react";
import {Playheader} from "./Playheader";
import Playlist from "./Playlist";
import firebase from "../firebase/Firebase";
import {MenuBasic} from "../menu/MenuBasic";

export class PlaySite extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Songs');

        this.updateSongs = this.updateSongs.bind(this);

        this.state = {
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
        return <div>
            <MenuBasic eventId={this.props.match.params.id}/>
            <Container>
                <Playheader/>
                <Playlist eventId={this.props.match.params.id} closeModal={this.closeModal.bind(this)} openModal={this.openModal.bind(this)} isModalOpen={this.state.isModalOpen} songs={this.state.songs} updatePlaylist={this.updatePlaylist()} />
            </Container>
        </div>
    }
}