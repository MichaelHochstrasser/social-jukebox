import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import PlaylistItem from "../playlist/Playlist";
import {Button, Container, Grid, Header, Input} from "semantic-ui-react";
import {Image} from "semantic-ui-react";
import {MenuBasic} from "../menu/MenuBasic";

export class SettingEvent extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        redirect: false
    }

    onSearch = () => {
        this.setState({
            redirect: true,
            target: '/event'
        })
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
                                        <Button basic color='orange'>Connect your spotify account</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Container>
                </div>
    }
}