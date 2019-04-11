import React, {Component} from 'react';
import {Search} from "semantic-ui-react";
import _ from 'lodash';
import PropTypes from 'prop-types';
import './SearchSong.css';
import './circle.css';

let songs = [];

const resultRenderer = ({id, image, title, artist, duration_ms, popularity}) => {
    return <div className='main-container' key={id}>
        <div className='left-content'>
            <img alt='song' height={55} src={image}/>
        </div>
        <div className='center-content'>
            <div className='song-title'>{title}</div>
            <div>{artist}</div>
            <div className='song-duration'>{millisToMinutesAndSeconds(duration_ms)}</div>
        </div>
        <div className='right-content'>
            <div className={'small green c100 p' + popularity}>
            <span>{popularity}%</span>
            <div className="slice">
                <div className="bar"></div>
                <div className="fill"></div>
            </div>
        </div>
        </div>
    </div>
};

function millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return (seconds === 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

resultRenderer.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    image: PropTypes.string,
    duration_ms: PropTypes.number,
    eventId: PropTypes.string
}

export class SearchSongs extends Component {
    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({isLoading: false, results: [], value: ''})

    handleResultSelect = (e, {result}) => {
        this.addSong(result);
        this.setState({value: result.artist + ' - ' + result.title});
        this.props.closeModal();
    }

    searchSong = (query) => {
        if (query) {
            const axios = require('axios');
            const url = 'http://localhost:5000/social-jukebox-zuehlke/us-central1/search?term=' + query + '&eventId=' + this.props.eventId;
            const header = {
                'Content-Type': 'application/json'
            };

            return axios.get(url, header);
        } else {
            songs = [];
        }
    }

    addSong = (song) => {
        const axios = require('axios');
        const url = 'http://localhost:5000/social-jukebox-zuehlke/us-central1/addSong';
        const body = {
            eventId: this.props.eventId,
            songId: song.id,
        };
        const header = {
            'Content-Type': 'application/json'
        };

        axios.post(url, body, header)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSearchChange = (e, {value}) => {
        if (value) {
            this.setState({isLoading: true, value})

            let that = this;

            this.searchSong(value).then(function (response) {
                console.log('Found ' + response.data.length + ' songs.');
                songs = response.data;
                const newSongs = songs.map(s => ({...s, key: s.id}));
                const re = new RegExp(_.escapeRegExp(that.state.value), 'i')
                const isMatch = result => re.test(result.title) || re.test(result.artist)

                that.setState({
                    isLoading: false,
                    results: _.filter(newSongs, isMatch).sort((a, b) => (a.popularity < b.popularity) ? 1 : -1),
                })
            })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            this.setState({isLoading: false, value});
        }

    }

    render() {
        const {isLoading, value, results} = this.state;

        return <Search
            loading={isLoading}
            input={{fluid: true}}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {leading: true})}
            results={results}
            resultRenderer={resultRenderer}
            value={value}/>
    }

}