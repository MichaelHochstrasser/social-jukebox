import React, {Component} from 'react';
import {Search} from "semantic-ui-react";
import _ from 'lodash';
import PropTypes from 'prop-types';
import './SearchSong.css';

const songs = [
    {
        "title": "Gimme! Gimme! Gimme! (A Man After Midnight)",
        "popularity": 73,
        "id": "3vkQ5DAB1qQMYO4Mr9zJN6",
        "duration_ms": 292613,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/7c0dfa9cacb9d4090f3faeef97a0626ed07ea039"
    },
    {
        "title": "Dancing Queen",
        "popularity": 77,
        "id": "0GjEhVFGZW8afUYGChu3Rr",
        "duration_ms": 230400,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/6b45b5c811a61187e21d66021f35aad253a42e50"
    },
    {
        "title": "Mamma Mia",
        "popularity": 72,
        "id": "2TxCwUlqaOH3TIyJqGgR91",
        "duration_ms": 213266,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/eef9ed04184b45945dbeef4525cd012365880bb9"
    },
    {
        "title": "The Winner Takes It All",
        "popularity": 72,
        "id": "3oEkrIfXfSh9zGnE7eBzSV",
        "duration_ms": 294720,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/9f9e4b079ca1179c0aba1775f53471390c7f3092"
    },
    {
        "title": "Super Trouper",
        "popularity": 70,
        "id": "0J2p4KYdr6Mg4ET6JPlbe1",
        "duration_ms": 252853,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/9f9e4b079ca1179c0aba1775f53471390c7f3092"
    },
    {
        "title": "Take A Chance On Me",
        "popularity": 69,
        "id": "5BckPAYcKEJuYs1eV1BHHe",
        "duration_ms": 243933,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/be8de1d9c79a82ad39075f9b7ace1f736c561be7"
    },
    {
        "title": "When I Kissed The Teacher",
        "popularity": 57,
        "id": "6zk4lFEYIWs1UZZ03NVetT",
        "duration_ms": 181133,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/6b45b5c811a61187e21d66021f35aad253a42e50"
    },
    {
        "title": "Dancing Queen",
        "popularity": 68,
        "id": "2ATDkfqprlNNe9mYWodgdc",
        "duration_ms": 231093,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/64e4b762ac4d85f69e13b31a87300e3dbd838c4c"
    },
    {
        "title": "Waterloo",
        "popularity": 66,
        "id": "3Dy4REq8O09IlgiwuHQ3sk",
        "duration_ms": 168960,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/9d91657d1dba003c5c38e82cf3e9050ede61551a"
    },
    {
        "title": "Thank You For The Music",
        "popularity": 59,
        "id": "08GOw3NsrJ0LsCCeyqzt3b",
        "duration_ms": 229453,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/be8de1d9c79a82ad39075f9b7ace1f736c561be7"
    },
    {
        "title": "Dancing Queen",
        "popularity": 60,
        "id": "1rMfDvE2C8ne8UZj847rKM",
        "duration_ms": 233440,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/a5db6a30ced13ec2f320e30902a808b6fcd950a1"
    },
    {
        "title": "Lay All Your Love On Me",
        "popularity": 63,
        "id": "2245x0g1ft0HC7sf79zbYN",
        "duration_ms": 272506,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/64e4b762ac4d85f69e13b31a87300e3dbd838c4c"
    },
    {
        "title": "Chiquitita",
        "popularity": 64,
        "id": "762B4bOcXF7I2Y8UlKTyTy",
        "duration_ms": 326320,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/7c0dfa9cacb9d4090f3faeef97a0626ed07ea039"
    },
    {
        "title": "Voulez-Vous",
        "popularity": 62,
        "id": "17OqI90oTFZ3J8PVu6j07V",
        "duration_ms": 309173,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/7c0dfa9cacb9d4090f3faeef97a0626ed07ea039"
    },
    {
        "title": "Fernando",
        "popularity": 63,
        "id": "4BM8yJ0PzBi2ZewpMTOxtx",
        "duration_ms": 252960,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/6b45b5c811a61187e21d66021f35aad253a42e50"
    },
    {
        "title": "S.O.S.",
        "popularity": 62,
        "id": "5pMmWfuL0FTGshYt7HVJ8P",
        "duration_ms": 201360,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/64e4b762ac4d85f69e13b31a87300e3dbd838c4c"
    },
    {
        "title": "Honey, Honey",
        "popularity": 57,
        "id": "2w6JXokk0F8i241Y8C0Mn6",
        "duration_ms": 175000,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/9d91657d1dba003c5c38e82cf3e9050ede61551a"
    },
    {
        "title": "I Have A Dream",
        "popularity": 59,
        "id": "1PtJclc46wTk367PlsU6Uj",
        "duration_ms": 285413,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/7c0dfa9cacb9d4090f3faeef97a0626ed07ea039"
    },
    {
        "title": "Does Your Mother Know",
        "popularity": 59,
        "id": "2HPB3px8MJZRMfu1L65Z41",
        "duration_ms": 193440,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/7c0dfa9cacb9d4090f3faeef97a0626ed07ea039"
    },
    {
        "title": "Knowing Me, Knowing You",
        "popularity": 64,
        "id": "798cuJeotvXP8UVa8GJPnD",
        "duration_ms": 241920,
        "artist": "ABBA",
        "image": "https://i.scdn.co/image/6b45b5c811a61187e21d66021f35aad253a42e50"
    }
];

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
            <div>{popularity}%</div>
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
    duration_ms: PropTypes.number
}

export class SearchSongs extends Component {
    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({isLoading: false, results: [], value: ''})

    handleResultSelect = (e, {result}) => {
        console.log(result);
        this.setState({value: result.artist + ' - ' + result.title});
        this.props.closeModal();
    }

    handleSearchChange = (e, {value}) => {
        this.setState({isLoading: true, value})

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const newSongs = songs.map(s => ({ ...s, key: s.id }));
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title) || re.test(result.artist)

            this.setState({
                isLoading: false,
                results: _.filter(newSongs, isMatch).sort((a, b) => (a.popularity < b.popularity) ? 1 : -1),
            })
        }, 300)
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