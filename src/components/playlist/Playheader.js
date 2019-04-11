import React, { Component } from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";
import firebase from "../firebase/Firebase";

export class Playheader extends Component {

    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('test');
        this.state = {
            currentSong: {title: 'Hit me baby one more time', artist: 'Britney', time: '2:15'}
        };
    }

    render() {
        return <Segment>
            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <h2>{this.state.currentSong.title}</h2>
                        <p>{this.state.currentSong.artist}</p>
                        <Icon name='play' />
                    </Grid.Column>
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