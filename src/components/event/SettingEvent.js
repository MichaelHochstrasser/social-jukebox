import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Button, Container, Grid, Header, Message} from "semantic-ui-react";
import {MenuBasic} from "../menu/MenuBasic";
import QRCode from 'qrcode-react';
import firebase from "../firebase/Firebase";

export class SettingEvent extends Component {

    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('Events');
        this.updateEvent = this.updateEvent.bind(this);
    }

    state = {
        event: {name: 'Unknown Event', refreshToken: 'empty', eventId: 'empty'},
        redirect: false
    }

    componentDidMount() {
        this.updateEvent();
    }

    updateEvent() {
        let eventId = this.props.match.params.id;
        this.db.where("eventId", "==", eventId)
            .get()
            .then(querySnapshot => {
                let events = [];
                querySnapshot.forEach(doc => events.push(doc.data()));
                if (events.length>0) {
                    this.setState({event: events[0]});
                } else {
                    this.setState({event: {name: 'Unknown Event'}});
                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }

    loadPage() {
        if(localStorage.getItem('userId')!=this.state.event.userId) {
            return (<Container><Message color='red'>Your are not an admin of this event. No Access.</Message></Container>);
        } else {
            return (<div>
                <MenuBasic eventId={this.props.match.params.id}/>
                <Container>
                    {this.renderRedirect()}
                    <div className="button-container">
                        <Grid>
                            <Grid.Row>
                                <Grid.Column textAlign='center'>
                                    <Header as='h1'>Settings</Header>
                                    <p>{this.state.event.userId}</p>
                                    <p>{localStorage.getItem('userId')}</p>
                                </Grid.Column>
                            </Grid.Row>
                            <ConnectComp event={this.state.event} eventId={this.props.match.params.id}/>
                            <Grid.Row><Grid.Column textAlign='center'><Header as='h2'>Share your event with friends</Header></Grid.Column></Grid.Row>
                            <Grid.Row><Grid.Column textAlign='center'><a href=''>https://jukebox.dj/event/{this.props.match.params.id}</a></Grid.Column></Grid.Row>
                            <Grid.Row><Grid.Column textAlign='center'><QRCode
                                value={`https://jukebox.dj/event/${this.props.match.params.id}`}
                                size={256}
                                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Love_Heart_symbol.svg/2000px-Love_Heart_symbol.svg.png"
                                bgColor="#2ED665"
                                fgColor="#000000"/></Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </Container>
            </div>);
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.target} />
        }
    }

    render() {
        return this.loadPage();
    }
}

class ConnectComp extends Component{

    connectSpotify = () => {
        window.location.replace(`https://accounts.spotify.com/authorize?client_id=68fd4d58904748c7bc63c038fa3a5f01&response_type=code&redirect_uri=http://localhost:5000/social-jukebox-zuehlke/us-central1/getSpotifyAccessToken&scope=user-read-birthdate%20user-read-email%20streaming%20user-read-private%20playlist-modify-public%20playlist-modify-private&state=${this.props.eventId}`);
    };

    render() {
        if (this.props.event.refreshToken === '' || this.props.event.refreshToken === null) {
            return (
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <Button basic color='orange' onClick={this.connectSpotify} size='huge'>Connect your spotify
                            account</Button>
                    </Grid.Column>
                </Grid.Row>
            )
        } else {
            return (
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <Message color='green'>You're successfully connected this party to a spotify account! Congrats!</Message>
                        <Button basic color='orange' onClick={this.connectSpotify} size='huge'>Re-Connect your spotify
                            account</Button>
                    </Grid.Column>
                </Grid.Row>
            )
        }
    }
}