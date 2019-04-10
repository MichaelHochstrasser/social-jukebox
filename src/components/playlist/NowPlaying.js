import React, { Component } from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";

export class NowPlaying extends Component {

    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('test');
        const song = {title: String, artist: String, time: String};
        this.state = {
            currentSong: {title: 'Hit me baby one more time', artist: 'Britney', time: '2:15'}
        };
    }

    componentWillMount() {
        window.onSpotifyWebPlaybackSDKReady = () => {
            // You can now initialize Spotify.Player and use the SDK
            const token = 'BQAwXGNVd-Ql05HwmhPgOFMrZc3FHvWTVNBp5RURcc1fAZg31_U7J2kyNscOveoV1v3r2KTlWeEno0P3OVag7vMyM2o5VFLzsdx5NsfTOsEZcm72q7sBtJQ2-6cPM0uXcQ9TqkrKa9_sV2kkgmbTmauctCIQ4gVBsBQ';
            const player = new window.Spotify.Player({
                name: 'Social Jukebox',
                getOAuthToken: cb => { cb(token); }
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => { console.log(state); });

            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect();
            console.log('LOADED!');
        };
    }

    render() {
        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container textAlign='center'>
                        <h2>{this.state.currentSong.title}</h2>
                        <p>{this.state.currentSong.artist}</p>
                        <Icon name='play' />
                    </Container>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Progress percent={10} size='tiny'>
                            {this.state.currentSong.time}
                        </Progress>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}