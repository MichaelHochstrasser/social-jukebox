import admin from "./admin";

import {
  Firestore,
  CollectionReference,
  DocumentReference,
  WriteResult,
  DocumentSnapshot
} from "@google-cloud/firestore";

import { Event } from "../model/Event";
import { Song } from "../model/Song";
import { SpotifyHelper } from "./SpotifyApiHelper";

export class FireStoreHelper {
  private firestore: Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  private getEventDocument(eventId?: string): DocumentReference {
    const collection: CollectionReference = this.firestore.collection("Events");

    return eventId ? collection.doc(eventId) : collection.doc();
  }

  createOrUpdateEvent(event: Event): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(event.eventId);

    return new Promise<string>((resolve, reject) => {
      if (event && event.playlistId) {
        resolve(event.playlistId);
      } else if (event.spotifyToken) {
        const spotifyHelper = new SpotifyHelper(event.spotifyToken);

        spotifyHelper
          .createPlaylist(event.name)
          .then(playlistId => {
            resolve(playlistId);
          })
          .catch(err => {
            throw err;
          });
      } else {
        resolve("");
      }
    })
      .then((playlistId: string) => {
        return docRef
          .set({ ...event, playlistId })
          .then((result: WriteResult) => {
            return {
              ...event,
              eventId: docRef.id
            } as Event;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(playListErr => {
        throw playListErr;
      });
  }

  deleteEvent(eventId: string): Promise<boolean> {
    const docRef: DocumentReference = this.getEventDocument(eventId);

    return docRef
      .delete()
      .then((result: WriteResult) => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getEvent(eventId: string): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(eventId);

    return docRef
      .get()
      .then((result: DocumentSnapshot) => {
        if (result.exists) {
          return {
            ...result.data(),
            eventId: result.id
          } as Event;
        }
        return;
      })
      .catch(err => {
        console.log(err);
      });
  }

  private getSongDocument(songId?: string): DocumentReference {
    const collection: CollectionReference = this.firestore.collection("Songs");

    return songId ? collection.doc(songId) : collection.doc();
  }

  addOrUpdateSong(song: Song, spotifyToken?: string): Promise<Song | void> {
    const docRef: DocumentReference = this.getSongDocument(song.songId);

    return new Promise<void>((resolve, reject) => {
      if (song && song.playlistId && spotifyToken) {
        const spotifyHelper = new SpotifyHelper(spotifyToken);

        spotifyHelper
          .addSongToPlaylist(song.playlistId, song.songId)
          .then(success => {
            if (success) {
              resolve();
            } else {
              reject(new Error("Could not add Song to Spotify Playlist!"));
            }
          })
          .catch(err => {
            throw err;
          });
      } else {
        reject(new Error("Playlist ID or Spotifytoken not available!"));
      }
    })
      .then(() => {
        return docRef
          .set({ ...song })
          .then((result: WriteResult) => {
            return {
              ...song,
              songId: docRef.id
            } as Song;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(spotifyAddError => {
        throw spotifyAddError;
      });
  }

  removeSong(songId: string) {
    const docRef: DocumentReference = this.getSongDocument(songId);

    return docRef
      .delete()
      .then((result: WriteResult) => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getSong(songId: string) {
    const docRef: DocumentReference = this.getSongDocument(songId);

    return docRef
      .get()
      .then((result: DocumentSnapshot) => {
        if (result.exists) {
          return {
            ...result.data(),
            songId: result.id
          } as Song;
        }
        return;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
