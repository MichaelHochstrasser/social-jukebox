import React, { Component } from 'react';
import firebase from './Firebase';

export class Sample extends Component {
    constructor(props) {
        super(props);
        this.db = firebase.firestore().collection('test');
        this.state = {
            songs: []
        };
    }

    onUpdate = (querySnapshot) => {
        const songs = [];
        querySnapshot.forEach((doc) => {
            const { song } = doc.data();
            songs.push({
                key: doc.id,
                song: song
            });
        });
        this.setState({songs});
    };

    componentDidMount() {
       this.db.onSnapshot(this.onUpdate);
    }

    render() {
        return (
            <div>
                {this.state.songs.map(song => <div key={song.key}>{song.song}</div>)}
            </div>
        );
    }
}