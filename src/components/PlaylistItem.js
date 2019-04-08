import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'

class PlaylistItem extends Component {
    render() {
        return <div class="ui container">
            <div class="ui grid">
                <div class="row">
                    <div class="column">
                        <p>{this.props.songtitle}</p>
                    </div>
                    <div className="right floated six column">
                        <Button.Group>
                            <Button positive>Upvote</Button>
                            <Button.Or>5</Button.Or>
                            <Button negative>Downvote</Button>
                        </Button.Group>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default PlaylistItem;