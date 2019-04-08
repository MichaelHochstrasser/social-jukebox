import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import {Link} from "react-router-dom";

export class MenuBasic extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu inverted>
                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}>
                    <Link to="/">Home</Link>
                </Menu.Item>

                <Menu.Item
                    name='host'
                    active={activeItem === 'host'}
                    onClick={this.handleItemClick}>
                    <Link to="/host">Host Event</Link>
                </Menu.Item>

                <Menu.Item
                    name='Invite'
                    active={activeItem === 'invite'}
                    onClick={this.handleItemClick}>
                    <Link to="/host/event">Invite To Event</Link>
                </Menu.Item>
                <Menu.Item
                    name='goto'
                    active={activeItem === 'goto'}
                    onClick={this.handleItemClick}>
                    <Link to="/event">Go To Event</Link>
                </Menu.Item>
            </Menu>
        )
    }
}