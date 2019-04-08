import React, {Component} from 'react';
import {Redirect} from "react-router-dom";

export class Home extends Component {
    state = {
        redirect: false
    }

    onCreateEvent = () => {
        this.setState({
            redirect: true,
            target: '/host'
        })
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
            {this.renderRedirect()}
            <button onClick={this.onCreateEvent}>Create event</button>
            <button onClick={this.onSearch}>Search & Join event</button>
        </div>
    }
}