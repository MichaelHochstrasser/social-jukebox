import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Button, Container, Grid, Header} from "semantic-ui-react";
import {MenuBasic} from "../menu/MenuBasic";
import QRCode from 'qrcode-react';

export class SettingEvent extends Component {

    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('Events');
        this.updateSongs = this.updateSongs.bind(this);
    }

    state = {
        redirect: false
    }

    componentDidMount() {
        this.updateSongs();
    }

    updateSongs() {
        let eventId = this.props.match.params.id;
        this.db.where("eventId", "==", eventId)
            .get()
            .then(querySnapshot => {
                let events = [];
                querySnapshot.forEach(doc => events.push(doc.data()));
                this.setState({events: events});
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }

    connectSpotify = () => {
        window.open(`https://accounts.spotify.com/authorize?client_id=68fd4d58904748c7bc63c038fa3a5f01&response_type=code&redirect_uri=http://localhost:5000/social-jukebox-zuehlke/us-central1/getSpotifyAccessToken&scope=user-read-private%20playlist-modify-public%20playlist-modify-private&state=${this.props.match.params.id}`)
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.target} />
        }
    }

    render() {
        return <div>
            <MenuBasic eventId={this.props.match.params.id}/>
            <Container>
                {this.renderRedirect()}
                <div className="button-container">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Header as='h1'>Settings</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Button basic color='orange' onClick={this.connectSpotify}>Connect your spotify account</Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row><Grid.Column textAlign='center'><Header as='h2'>Share your event with friends</Header></Grid.Column></Grid.Row>
                        <Grid.Row><Grid.Column textAlign='center'><a href=''>https://jukebox.dj/event/{this.props.match.params.id}</a></Grid.Column></Grid.Row>
                        <Grid.Row><Grid.Column textAlign='center'><QRCode
                            value={`https://jukebox.dj/event/${this.props.match.params.id}`}
                            size={256}
                            logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Love_Heart_symbol.svg/2000px-Love_Heart_symbol.svg.png"
                            bgColor="#2ED665"
                            fgColor="#000000"/></Grid.Column></Grid.Row>
                    </Grid>
                </div>
            </Container>
        </div>
    }
}