import admin from "./admin";
import {
  Firestore,
  CollectionReference,
  DocumentReference,
  WriteResult,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  QueryDocumentSnapshot
} from "@google-cloud/firestore";

import { SONG_COLLECTION, EVENT_COLLECTION } from "./constants";

import { Event } from "../model/Event";
import { Song } from "../model/Song";

import { SpotifyHelper } from "./SpotifyApiHelper";

export class FireStoreHelper {
  private firestore: Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  private getEventDocument(eventId?: string): DocumentReference {
    const collection: CollectionReference = this.firestore.collection(EVENT_COLLECTION);

    return eventId ? collection.doc(eventId) : collection.doc();
  }

  createOrUpdateEvent(event: Event): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(event.eventId);

    return new Promise<string>((resolve, reject) => {
      if (event && event.playlistId) {
        resolve(event.playlistId);
      } else if (event.spotifyToken) {
        const spotifyHelper = new SpotifyHelper(
          event.spotifyToken,
          event.refreshToken,
          event.validUntil
        );

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
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch((playListErr: Error) => {
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
        throw err;
      });
  }

  updateTokens(
    oldAccessToken: string,
    newAccessToken: string,
    refreshToken: string,
    validUntil: number
  ): Promise<void> {
    console.log("Updating Spotify tokens");

    const queryRef: Query = this.firestore
      .collection(EVENT_COLLECTION)
      .where("spotifyToken", "==", oldAccessToken);

    return queryRef
      .get()
      .then((result: QuerySnapshot) => {
        console.log("Attempting to update these Events", result.docs);

        if (result && result.docs) {
          return Promise.all(
            result.docs.map((doc: QueryDocumentSnapshot) => {
              return this.createOrUpdateEvent({
                ...doc.data,
                refreshToken,
                spotifyToken: newAccessToken,
                validUntil
              } as Event)
                .then(() => {
                  console.log("Successfully updated tokens of Event");
                  return Promise.resolve();
                })
                .catch(updateError => {
                  console.error(`Error while updating token of Event`, {
                    err: updateError,
                    data: doc.data
                  });
                  throw updateError;
                });
            })
          )
            .then(() => Promise.resolve())
            .catch(updateAllError => {
              throw updateAllError;
            });
        } else {
          return Promise.resolve();
        }
      })
      .catch((err: Error) => {
        console.log(err.message);
        throw err;
      });
  }

  private getNewSongDocument(): DocumentReference {
    const collection: CollectionReference = this.firestore.collection(SONG_COLLECTION);

    return collection.doc();
  }

  private getExistingSongDocument(spotifySongId: string, eventId: string): Promise<DocumentReference | null> {
    const collection: CollectionReference = this.firestore.collection(SONG_COLLECTION);

    // Query for the Song
    const queryRef: Query = collection.where('spotifySongId', '==', spotifySongId).where('eventId', '==', eventId);

    return queryRef.get().then((result: QuerySnapshot) => {
      if (result.docs && result.docs.length) {
        return result.docs[0].ref;
      } else {
        // Can't find the song
        return null;
      }
    }).catch((err) => { throw err; });
  }

    getPlaylist(eventId: string): Promise<Song[] | void> {
        return this.firestore.collection("Songs")
            .where("eventId", "==", eventId)
            .orderBy("voteCount", "desc")
            .orderBy("dateAdded", "asc")
            .get()
            .then((snapshot: QuerySnapshot) => {
                if (!snapshot.empty) {
                    const result: Song[] = [];
                    snapshot.forEach(doc => {
                        result.push(doc.data() as Song);
                    });

                    return result;
                }
                console.error("Could not find any songs for event!");
                return;
            })
            .catch(err => {
                console.log(err);
            });
    }

    addOrUpdateSong(song: Song, spotifyToken?: string, refreshToken?: string, validUntil?: number): Promise<Song | void> {
        let isNew: boolean;

        return new Promise<DocumentReference>((resolve, reject) => {
            this.getExistingSongDocument(song.spotifySongId, song.eventId).then((docRef: DocumentReference | null) => {
                if (docRef) {
                    // Song exists, proceed
                    isNew = false;
                    resolve(docRef);
                } else {
                    // Song does not exist, return new one
                    isNew = true;
                    resolve(this.getNewSongDocument());
                }
            }).catch((err) => {
                reject(err);
            });
        }).then((docRef: DocumentReference) => {
            // TODO: Separate SongId & internal Id!
            // TODO: Check if song already exists in event --> then it's and upate! else it's and add!
            console.log("Add or Update Song", song);

            return new Promise<void>((resolve, reject) => {
                if (!isNew) {
                    // If the song is not new, we don't need to add it to the playlist.
                    console.log('Song is not new, not adding it to Playlist.');
                    resolve();
                } else if (isNew && song && song.playlistId && spotifyToken) {
                    console.log('Attempting to add Song to Spotify Playlist.');
                    const spotifyHelper = new SpotifyHelper(spotifyToken, refreshToken, validUntil);

                    spotifyHelper
                        .addSongToPlaylist(song.playlistId, song.spotifySongId)
                        .then(success => {
                            if (success) {
                                console.log('Successfully added song to playlist');
                                resolve();
                            } else {
                                console.log('Could not add Song to Spotify Playlist!');
                                reject(new Error("Could not add Song to Spotify Playlist!"));
                            }
                        })
                        .catch((err: Error) => {
                            console.log(err.message);
                            throw err;
                        });
                } else {
                    console.log('Playlist ID or Spotifytoken not available!');
                    reject(new Error("Playlist ID or Spotifytoken not available!"));
                }
            })
                .then(() => {
                    console.log('Saving Song to FireStore.')
                    return docRef
                        .set({ ...song })
                        .then((result: WriteResult) => {
                            return song;
                        })
                        .catch(err => {
                            console.log(err);
                            throw err;
                        });
                })
                .catch(spotifyAddError => {
                    throw spotifyAddError;
                });
        }).catch((err: Error) => {
            console.log('Error getting Song Document');
            throw err;
        });
    }

  /* removeSong(songId: string) {
    const docRef: DocumentReference = this.getExistingSongDocument(songId);

    return docRef
      .delete()
      .then((result: WriteResult) => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  } */

  getSong(spotifySongId: string, eventId: string): Promise<Song | null> {
    return this.getExistingSongDocument(spotifySongId, eventId).then((docRef: DocumentReference | null) => {
      if (docRef) {
        return docRef
        .get()
        .then((result: DocumentSnapshot) => {
          if (result.exists) {
            return result.data() as Song;
          } else {
            return null;
          }
        }).catch(err => {
          console.log(err);
          throw err;
        });
      } else {
        return null;
      }
    }).catch((err: Error) => { console.log(err.message); throw err; });
  }
}
