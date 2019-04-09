import React, { Component } from 'react'
import {Icon, Menu} from 'semantic-ui-react'
import {Link} from "react-router-dom";

export class MenuBasic extends Component {
    state = {}

    constructor(props) {
        super(props)
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu icon='labeled'>
                <Link to={`/`}>
                    <Menu.Item>
                        <Icon name='home' />
                        Home
                    </Menu.Item>
                </Link>
                <Link to={`/event/${this.props.eventId}`}>
                    <Menu.Item>
                        <Icon name='music' />
                        Event
                    </Menu.Item>
                </Link>
                <Link to="/event">
                    <Menu.Item>
                        <Icon name='exchange' />
                        Change Event
                    </Menu.Item>
                </Link>

                <Link to={`/event/${this.props.eventId}/setting`}>
                    <Menu.Item>
                        <Icon name='setting' />
                        Settings
                    </Menu.Item>
                </Link>
            </Menu>
        )
    }
}