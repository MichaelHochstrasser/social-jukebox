import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {Image} from "semantic-ui-react";
import './Home.css'

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
            <h1 className="title">Social Jukebox</h1>
            <Image className="title-image" src={process.env.PUBLIC_URL + '/images/crowd.jpeg'} />
            {this.renderRedirect()}
            <div className="button-container">
                <button class="home-button positive ui button" onClick={this.onCreateEvent}><span className="home-button-text">Create event</span></button>
            <button class="home-button positive ui button" onClick={this.onSearch}><span className="home-button-text">Search & Join event</span></button>
            </div>
        </div>
    }
}