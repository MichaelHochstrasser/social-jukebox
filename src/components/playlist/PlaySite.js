import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { NowPlaying } from "./NowPlaying";
import Playlist from "./Playlist";
import firebase from "../firebase/Firebase";
import { MenuBasic } from "../menu/MenuBasic";
import { Playheader } from "./Playheader";

export class PlaySite extends Component {
  constructor(props) {
    super(props);

    this.db = firebase.firestore().collection("Songs");
    this.eventDb = firebase.firestore().collection("Events");

    this.updateSongs = this.updateSongs.bind(this);

    this.state = {
      event: null,
      songs: [],
      currentSong: {},
      isModalOpen: false,
      sessionId: "",
      userId: null
    };

    this.setSessionId();
  }

  setSessionId() {
    if (localStorage.getItem("sessionId") == undefined) {
      localStorage.setItem("sessionId", this.randomSession().toString());
    }
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  updatePlaylist() {
    this.updateSongs();
  }

  componentDidMount() {
    this.updatePlaylist();
    this.loadEvent();
    this.setState({ userId: localStorage.getItem("userId") });
  }

  updateSongs() {
    let eventId = this.props.match.params.id;
    this.db
      .where("eventId", "==", eventId)
      .orderBy("voteCount", "desc")
      .orderBy("dateAdded", "asc")
      .get()
      .then(querySnapshot => {
        let songs = [];
        querySnapshot.forEach(doc => songs.push(doc.data()));

        this.setState({
          songs: songs.filter((item, index) => item.voteCount < 9999999999),
          currentSong: songs[0]
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  loadEvent() {
    let eventId = this.props.match.params.id;
    this.eventDb
      .doc(eventId)
      .get()
      .then(eventDoc => {
        if (eventDoc.exists) {
          this.setState({
            event: eventDoc.data()
          });
        } else {
          console.log("Event not found!");
        }
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }

  randomSession() {
    const min = 10000;
    const max = 10000000000000000;
    const rand = Math.round(min + Math.random() * (max - min));
    return rand;
  }

  render() {
    let eventId = this.props.match.params.id;
    const { event, userId, currentSong } = this.state;

    return (
      <div>
        <MenuBasic eventId={eventId} />
        <Container>
          {event && event.userId === userId ? (
            <NowPlaying
              eventId={eventId}
              currentSong={this.state.currentSong}
            />
          ) : (
            <Playheader currentlyPlayingSong={currentSong} />
          )}
          {event && <h1>{event.name}</h1>}
          <Playlist
            eventId={this.props.match.params.id}
            closeModal={this.closeModal.bind(this)}
            openModal={this.openModal.bind(this)}
            isModalOpen={this.state.isModalOpen}
            songs={this.state.songs}
            updatePlaylist={this.updatePlaylist()}
          />
        </Container>
      </div>
    );
  }
}
