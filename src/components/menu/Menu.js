import React, { Component } from 'react';

export class Menu extends Component {

    render() {
        return <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/host">Host Event</Link></li>
            <li><Link to="/host/event">Invite To Event</Link></li>
            <li><Link to="/event">Go To Event</Link></li>
        </ul>
    }
}