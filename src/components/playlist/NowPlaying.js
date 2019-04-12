import React, {Component} from 'react';
import {Container, Grid, Icon, Image, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";
import {BACKEND_BASE_URL} from "../../shared/constants";

export class NowPlaying extends Component {

    constructor(props) {
        super(props);
        this.player = null;
        this.trackProgressTimer = {};

        this.resetFinishedSong = this.resetFinishedSong.bind(this);

        this.state = {
            currentTrack: {},
            trackPosition: 0,
            trackDuration: 1,
            paused: true,
        };
    }


    componentDidMount() {
        const spotifyPlayerScriptTag = document.createElement('script');
        spotifyPlayerScriptTag.src = "https://sdk.scdn.co/spotify-player.js";
        spotifyPlayerScriptTag.id = "spotifyPlayer";
        document.body.appendChild(spotifyPlayerScriptTag);
        window.onSpotifyWebPlaybackSDKReady = () => this.setUpSpotifyPlayer();


        const timeInterval = 250;
        this.trackProgressTimer = window.setInterval(() => {
            if (!this.state.paused) {
                this.state.trackPosition += timeInterval;
            }
        }, timeInterval);
    }

    componentWillUnmount() {
        window.clearInterval(this.trackProgressTimer);

        if (this.player) {
            this.player.disconnect();
        }
        let spotifyPlayerScriptyTag = document.getElementById("spotifyPlayer");
        document.body.removeChild(spotifyPlayerScriptyTag);
    }

    setUpSpotifyPlayer() {
        const eventDocRef = firebase.firestore().collection('Events').doc(this.props.eventId);
        eventDocRef.get()
            .then(doc => {
                let token = doc.data().spotifyToken;
                this.player = new window.Spotify.Player({
                    name: 'Social Jukebox',
                    getOAuthToken: cb => {
                        cb(token);
                    }
                });

                // Error handling
                this.player.addListener('initialization_error', ({message}) => console.error(message));
                this.player.addListener('authentication_error', ({message}) => console.error(message));
                this.player.addListener('account_error', ({message}) => console.error(message));
                this.player.addListener('playback_error', ({message}) => console.error(message));

                // Playback status updates
                this.player.addListener('player_state_changed', state => {
                    if (state) {
                        let currentTrack = state.track_window.current_track;
                        if (currentTrack) {
                            if (this.state.currentTrack.uri && currentTrack.uri !== this.state.currentTrack.uri) {
                                this.resetFinishedSong(this.state.currentTrack.id)
                            }
                            this.setState({currentTrack: currentTrack});
                        }
                        this.setState({paused: state.paused, currentTrack: currentTrack, trackPosition: state.position, trackDuration: state.duration});
                    }
                });

                // Ready
                this.player.addListener('ready', ({device_id}) => console.log('Ready with Device ID', device_id));

                // Not Ready
                this.player.addListener('not_ready', ({device_id}) => console.log('Device ID has gone offline', device_id));

                // Connect to the player!
                this.player.connect();
            })
            .catch(error => console.log("Error getting document: ", error));
    }

    resetFinishedSong(songId) {
        const axios = require('axios');

        const url = `${BACKEND_BASE_URL}/resetFinishedSong?eventId=${this.props.eventId}&songId=${songId}`;
        const header = {
            'Content-Type': 'application/json'

        };

        axios.get(url, header)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        if (!this.props.currentSong) {
            return <div></div>;
        }
        const trackTitle = this.state.currentTrack.name ? this.state.currentTrack.name : this.props.currentSong.title;
        const image = this.state.currentTrack.album ? this.state.currentTrack.album.images[0].url : this.props.currentSong.image;
        const artistName = this.state.currentTrack.artists ? this.state.currentTrack.artists[0].name : this.props.currentSong.artist;
        const trackProgress = (this.state.trackPosition / this.state.trackDuration) * 100;

        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container align='center'>
                        <h2>{trackTitle}</h2>
                        <p>{artistName}</p>
                        <div style={{paddingBottom: '1em'}}><Image src={image} size='medium'/></div>
                        <div><Icon name={(this.state.paused) ? 'play' : 'pause'} size='big' /></div>
                    </Container>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Progress percent={trackProgress} size='tiny'>
                            {this.state.currentTrack.time}
                        </Progress>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}