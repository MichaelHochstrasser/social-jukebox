import React, {Component} from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";

export class NowPlaying extends Component {

    constructor(props) {
        super(props);
        this.player = {};
        this.trackProgressTimer = {};

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
                        this.setState({paused: state.paused, currentTrack: state.track_window.current_track, trackPosition: state.position, trackDuration: state.duration});
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

    render() {
        const artistName = this.state.currentTrack.artists ? this.state.currentTrack.artists[0].name : '';
        const trackProgress = (this.state.trackPosition / this.state.trackDuration) * 100;
        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container textAlign='center'>
                        <h2>{this.state.currentTrack.name}</h2>
                        <p>{artistName}</p>
                        <Icon name={(this.state.paused) ? 'play' : 'pause'} size='big' />
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