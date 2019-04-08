import React, { Component } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react'

class PlaylistItem extends Component {
    render() {
        return <div class="ui container">
            <div class="ui grid">
                <div class="row">
                    <div class="column">
                        <p>{this.props.songtitle}</p>
                    </div>
                    <div className="right floated six column">
                        <Button as='div' labelPosition='left'>
                            <Label as='a' basic color='green' pointing='right'>
                                {this.props.votes}
                            </Label>
                            <Button color='green'>
                                <Icon name='heart' />
                                Like
                            </Button>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PlaylistItem;