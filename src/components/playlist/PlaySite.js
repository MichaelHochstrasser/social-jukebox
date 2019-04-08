import React, { Component } from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import {Playheader} from "./Playheader";
import PlaylistItem from "./PlaylistItem";
import Playlist from "./Playlist";

export class PlaySite extends Component {

    render() {
        return <Container>
            <Playheader/>
            <Playlist/>
        </Container>
    }
}