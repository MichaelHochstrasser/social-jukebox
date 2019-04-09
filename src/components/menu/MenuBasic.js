import React, { Component } from 'react'
import {Icon, Menu} from 'semantic-ui-react'
import {Link} from "react-router-dom";

export class MenuBasic extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state

        return (
            <Menu icon='labeled'>
                <Link to="/">
                    <Menu.Item>
                        <Icon name='exchange' />
                        Change Event
                    </Menu.Item>
                </Link>

                <Link to="/">
                    <Menu.Item>
                        <Icon name='setting' />
                        Admin
                    </Menu.Item>
                </Link>
            </Menu>
        )
    }
}