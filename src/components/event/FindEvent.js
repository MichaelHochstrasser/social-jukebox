import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, Container, Grid, Segment} from "semantic-ui-react";

export class FindEvent extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Events');
    }

    state = {
        events: []
    }

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate )
    }

    onUpdate = (querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            const { name } = doc.data();
            events.push({
                key: doc.id,
                name: name
            });
        });
        this.setState({events});
    };

    render() {

        return <Container>
            <Grid>
                <h1>Choose an Event</h1>
                <Grid.Row>
                    <Grid.Column textAlign='right'>
                        <Button basic><Link to={'/'}>Create new Event</Link></Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.state.events.map(event =>
                            <Link to={`/event/${event.key}`}>
                                <Segment>
                                    {event.name}
                                </Segment>
                            </Link>
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    }
}