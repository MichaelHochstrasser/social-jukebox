import React, { Component } from 'react';
import {Search} from "semantic-ui-react";

export class SearchSongs extends Component {

    render() {
        return <Search input={{ fluid: true }} />
    }

}