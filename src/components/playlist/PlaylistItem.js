import React, { Component } from 'react';
import { Grid, Button, Icon, Label, Segment, Table, Header, Image } from 'semantic-ui-react'

class PlaylistItem extends Component {
    render() {
        return <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src={process.env.PUBLIC_URL + '/images/song2.jpg'} rounded size='mini' />
                        <Header.Content>
                            {this.props.songtitle}
                            <Header.Subheader>{this.props.artist}</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>
                    <Button.Group size='tiny'>
                        <Button icon color='red'><Icon name='thumbs down outline' /></Button>
                        <Button basic color='grey'>{this.props.votes}</Button>
                        <Button icon color='green'><Icon name='thumbs up outline' /></Button>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
    }
}

export default PlaylistItem;