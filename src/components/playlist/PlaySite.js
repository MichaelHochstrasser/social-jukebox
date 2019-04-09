import React, { Component } from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import {Playheader} from "./Playheader";
import PlaylistItem from "./PlaylistItem";
import Playlist from "./Playlist";
import firebase from "../firebase/Firebase";

export class PlaySite extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('test');

        this.state = {
            event: {}
        };
    }

    componentDidMount() {
        this.db = firebase.firestore().collection('test');
    }

    render() {
        return <Container>
            <Playheader/>
            <Playlist/>
        </Container>
    }
}