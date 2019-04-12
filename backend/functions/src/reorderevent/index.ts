import * as functions from "firebase-functions";

import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Song } from "../model/Song";
import { SpotifyHelper } from "../shared/SpotifyApiHelper";
import { Event } from "../model/Event";

export default functions.pubsub
  .topic("reorder-spotify-playlist")
  .onPublish(message => {
    let eventId: string;

    try {
      eventId = message.json.eventId;
    } catch (e) {
      console.error("PubSub message was not JSON", e);
      return;
    }

    if (eventId) {
      const firestoreHelper = new FireStoreHelper();

      firestoreHelper
        .getEvent(eventId)
        .then((event: Event | void) => {
          if (event) {
            firestoreHelper
              .getPlaylist(eventId)
              .then((songs: Song[] | void) => {
                if (songs) {
                  if (songs.length) {
                    // What happens to the active playing song?
                    // What happens when we send too much updates?

                    if (event.playlistId) {
                      const spotifyHelper = new SpotifyHelper(
                        event.spotifyToken,
                        event.refreshToken,
                        event.validUntil
                      );

                      spotifyHelper
                        .replaceSongsOnPlaylist(
                          event.playlistId,
                          songs.map(song => song.spotifySongId)
                        )
                        .then(() => {
                          console.log(
                            "Successfully updated Playlist on Spotify!"
                          );
                          return true;
                        })
                        .catch(err => {
                          throw err;
                        });
                    } else {
                      throw new Error("Event has no Playlist!");
                    }
                  } else {
                    console.error("THIS SHOULD NEVER HAPPEN!");
                    console.log("Nothing to do here, Playlist is empty");
                  }
                } else {
                  throw new Error("Could not load Songs!");
                }
              })
              .catch(playlistErr => {
                console.log(playlistErr.message);
              });
          } else {
            throw new Error("Could not load Event");
          }
        })
        .catch((err: Error) => {
          console.error("Could not load Event", err);
        });
    } else {
      console.error("Event Id was not passed");
      return;
    }
  });
