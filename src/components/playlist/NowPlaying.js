import React, {Component} from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";

export class NowPlaying extends Component {

    constructor(props) {
        super(props);
        this.spotifyWebPlaybackSDKReady = false;
        this.player = {};

        //this.setUpSpotifyPlayer = this.setUpSpotifyPlayer.bind(this);
        this.state = {
            currentTrack: {},
            paused: true,
        };
    }

    componentDidMount() {
        const spotifyPlayerScriptTag = document.createElement('script');
        spotifyPlayerScriptTag.src = "https://sdk.scdn.co/spotify-player.js";
        spotifyPlayerScriptTag.id = "spotifyPlayer";
        document.body.appendChild(spotifyPlayerScriptTag);
        window.onSpotifyWebPlaybackSDKReady = () => this.setUpSpotifyPlayer();
    }

    componentWillUnmount() {
        this.player.disconnect();
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
                    console.log(state);
                    if (state) {
                        this.setState({paused: state.paused, currentTrack: state.track_window.current_track});
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
        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container textAlign='center'>
                        <h2>{this.state.currentTrack.name}</h2>
                        <p>{artistName}</p>
                        <Icon name={(this.state.paused) ? 'play' : 'pause'} />
                    </Container>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Progress percent={10} size='tiny'>
                            {this.state.currentTrack.time}
                        </Progress>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}