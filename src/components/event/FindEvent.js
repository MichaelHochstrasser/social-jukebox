import firebase from "../firebase/Firebase";
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Button, Container, Grid, Header, Message, Segment} from "semantic-ui-react";

export class FindEvent extends Component {

    constructor(props) {
        super(props);

        this.db = firebase.firestore().collection('Events').where("userId", "==", localStorage.getItem("userId"));
    }

    state = {
        events: [],
        userId: null
    };

    componentDidMount() {
        this.db.onSnapshot(this.onUpdate )
        this.setState({userId: localStorage.getItem("userId")});
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

        return <div>
            <Container>
                <div className="button-container">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Header as='h1'>Choose an event</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='right'>
                                <Button basic><Link to={'/'}>Create new Event</Link></Button>
                            </Grid.Column>
                        </Grid.Row>
                        {this.state.userId==null? <Grid.Row><Grid.Column><Message color='orange'>Please log in</Message></Grid.Column></Grid.Row> :
                        <Grid.Row>
                            <Grid.Column>
                                {this.state.events.map(event =>
                                    <Link to={`/event/${event.key}`} key={event.key}>
                                        <Segment>
                                            {event.name}
                                        </Segment>
                                    </Link>
                                )}
                            </Grid.Column>
                        </Grid.Row>}
                    </Grid>
                </div>
            </Container>
        </div>
    }
}