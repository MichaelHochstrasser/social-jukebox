import React, {Component} from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";

export class NowPlaying extends Component {

    constructor(props) {
        super(props);
        this.spotifyWebPlaybackSDKReady = false;

        //this.setUpSpotifyPlayer = this.setUpSpotifyPlayer.bind(this);
        this.state = {
            currentSong: {title: 'Hit me baby one more time', artist: 'Britney', time: '2:15'},
            paused: true
        };
    }

    componentWillMount() {
        window.onSpotifyWebPlaybackSDKReady = () => this.spotifyWebPlaybackSDKReady = true;

        let eventDocRef = firebase.firestore().collection('Events').doc(this.props.eventId);
        eventDocRef.get()
            .then(doc => {
                let token = doc.data().spotifyToken;
                if (this.spotifyWebPlaybackSDKReady) {
                    this.setUpSpotifyPlayer(token)
                } else {
                    window.onSpotifyWebPlaybackSDKReady = () => this.setUpSpotifyPlayer(token);
                }
            })
            .catch(error => console.log("Error getting document: ", error));
    }

    setUpSpotifyPlayer(token) {
        const player = new window.Spotify.Player({
            name: 'Social Jukebox',
            getOAuthToken: cb => {
                cb(token);
            }
        });

        // Error handling
        player.addListener('initialization_error', ({message}) => console.error(message));
        player.addListener('authentication_error', ({message}) => console.error(message));
        player.addListener('account_error', ({message}) => console.error(message));
        player.addListener('playback_error', ({message}) => console.error(message));

        // Playback status updates
        player.addListener('player_state_changed', state => {
            console.log(state);
            this.setState({paused: state.paused})
        });

        // Ready
        player.addListener('ready', ({device_id}) => console.log('Ready with Device ID', device_id));

        // Not Ready
        player.addListener('not_ready', ({device_id}) => console.log('Device ID has gone offline', device_id));

        // Connect to the player!
        player.connect();
    }

    render() {
        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container textAlign='center'>
                        <h2>{this.state.currentSong.title}</h2>
                        <p>{this.state.currentSong.artist}</p>
                        <Icon name={(this.state.paused) ? 'play' : 'pause'} />
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