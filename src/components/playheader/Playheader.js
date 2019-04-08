import React, { Component } from 'react';
import {Container, Grid, Icon, Progress, Segment} from "semantic-ui-react";

export class Playheader extends Component {

    render() {
        return <Segment>
            <Grid className="App" columns={1}>
                <Grid.Row>
                    <Container textAlign='center'>
                        <h2>Hit me baby one more time</h2>
                        <p>Britney Spears</p>
                        <Icon name='play' />
                    </Container>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Progress percent={10} size='tiny'>
                            4:30
                        </Progress>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}