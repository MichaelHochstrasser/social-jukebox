import React, { Component } from 'react';
import {Search} from "semantic-ui-react";
import _ from 'lodash'

const songs = [
    {
        key: 0,
        title: "Test Song 1",
    },
    {
        key: 1,
        title: "Test Song 2",
    },
    {
        key: 2,
        title: "Test Song 3",
    }
];

export class SearchSongs extends Component {
    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.setState({
                isLoading: false,
                results: _.filter(songs, isMatch),
            })
        }, 300)
    }

    render() {
        const { isLoading, value, results } = this.state;

        return <Search
            loading={isLoading}
            input={{ fluid: true }}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}/>
    }

}