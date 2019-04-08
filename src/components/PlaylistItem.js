import React, { Component } from 'react';
import { Grid, Button, Icon, Label, Segment } from 'semantic-ui-react'

class PlaylistItem extends Component {
    render() {
        return <Segment>
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column>
                        <img src={process.env.PUBLIC_URL + '/images/song.jpg'} width="100px" />
                    </Grid.Column>
                    <Grid.Column>
                        <p>{this.props.songtitle}</p>
                    </Grid.Column>
                    <Grid.Column>
                        <Button as='div' labelPosition='left'>
                            <Label as='a' basic color='green' pointing='right'>
                                {this.props.votes}
                            </Label>
                            <Button basic color='green'>
                                <Icon name='heart' />
                                Like
                            </Button>
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }
}

export default PlaylistItem;