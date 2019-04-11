import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Button, Container, Grid, Header, Message} from "semantic-ui-react";
import {MenuBasic} from "../menu/MenuBasic";
import QRCode from 'qrcode-react';
import firebase from "../firebase/Firebase";
import { FRONTEND_BASE_URL, BACKEND_BASE_URL } from '../../shared/constants';

export class SettingEvent extends Component {

    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('Events');
        this.updateEvent = this.updateEvent.bind(this);
    }

    state = {
        event: {name: 'Unknown Event', refreshToken: 'empty', eventId: 'empty', userId: ''},
        redirect: false,
        userId: ''
    }

    componentDidMount() {
        this.updateEvent();
        this.setState({userId: localStorage.getItem('userId')});
    }

    updateEvent() {
        let eventId = this.props.match.params.id;
        this.db.doc(eventId)
            .get()
            .then(eventDoc => {
                if (eventDoc.exists) {
                    this.setState({
                        event: eventDoc.data()
                    })
                } else {
                    console.log('Event not found!');
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    loadPage() {
        if(this.state.userId!=this.state.event.userId) {
            return (<div>
                <MenuBasic eventId={this.props.match.params.id}/>
                <Container>
                    <Message color='red'>Your are not an admin of this event. No Access.</Message>
                </Container>
            </div>);
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
                                </Grid.Column>
                            </Grid.Row>
                            <ConnectComp event={this.state.event} eventId={this.props.match.params.id}/>
                            <Grid.Row><Grid.Column textAlign='center'><Header as='h2'>Share your event with friends</Header></Grid.Column></Grid.Row>
                            <Grid.Row><Grid.Column textAlign='center'><a href={`${FRONTEND_BASE_URL}/event/${this.props.match.params.id}`}>{FRONTEND_BASE_URL}/event/{this.props.match.params.id}</a></Grid.Column></Grid.Row>
                            <Grid.Row><Grid.Column textAlign='center'><QRCode
                                value={`${FRONTEND_BASE_URL}/event/${this.props.match.params.id}`}
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
        window.location.replace(`https://accounts.spotify.com/authorize?client_id=68fd4d58904748c7bc63c038fa3a5f01&response_type=code&redirect_uri=${BACKEND_BASE_URL}/getSpotifyAccessToken&scope=user-read-birthdate%20user-read-email%20streaming%20user-read-private%20playlist-modify-public%20playlist-modify-private&state=${this.props.eventId}`);
    };

    render() {
        if (!this.props.event.refreshToken) {
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
                        <Message color='green'>
                            <b>Connected</b>
                            <p>You're successfully connected this party to a spotify account! Congrats!</p>
                            <p>If you wish to re-connect the account click the re-connect button.</p>
                            <p><Button basic onClick={this.connectSpotify}>Re-connect</Button></p></Message>
                    </Grid.Column>
                </Grid.Row>
            )
        }
    }
}