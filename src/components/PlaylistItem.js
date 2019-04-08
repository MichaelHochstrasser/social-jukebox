import React, { Component } from 'react';
import { Grid, Button, Icon, Label, Segment } from 'semantic-ui-react'

class PlaylistItem extends Component {
    render() {
        return <Segment>
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column class='four wide column'>
                        <img src={process.env.PUBLIC_URL + '/images/song2.jpg'} width="80dp" height="80dp"/>
                    </Grid.Column>
                    <Grid.Column class='eight wide column'>
                        <p>{this.props.songtitle}</p>
                    </Grid.Column>
                    <Grid.Column class='two wide column'>
                        <Button.Group size='small'>
                            <Button icon color='red'><Icon name='thumbs down outline' /></Button>
                            <Button basic color='grey'>{this.props.votes}</Button>
                            <Button icon color='green'><Icon name='thumbs up outline' /></Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}

export default PlaylistItem;