import * as functions from "firebase-functions";

import { REORDER_TOPIC } from "../shared/constants";

import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Song } from "../model/Song";
import { SpotifyHelper } from "../shared/SpotifyApiHelper";
import { Event } from "../model/Event";

export default functions.pubsub.topic(REORDER_TOPIC).onPublish(message => {
  let eventId: string;

  try {
    eventId = message.json.eventId;
  } catch (e) {
    console.error("PubSub message was not JSON", e);
    return false;
  }

  if (eventId) {
    const firestoreHelper = new FireStoreHelper();

    return firestoreHelper
      .getEvent(eventId)
      .then((event: Event | void) => {
        if (event) {
          return firestoreHelper
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

                    let songsToSend = songs.map(song => song.spotifySongId);

                    if (songs[0].voteCount >= 99999999998) {
                      songsToSend = songsToSend.slice(1);
                    }

                    return spotifyHelper
                      .replaceSongsOnPlaylist(event.playlistId, songsToSend)
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
                  return true;
                }
              } else {
                throw new Error("Could not load Songs!");
              }
            })
            .catch(playlistErr => {
              console.log(playlistErr.message);
              throw playlistErr;
            });
        } else {
          throw new Error("Could not load Event");
        }
      })
      .catch((err: Error) => {
        console.error("Could not load Event", err);
        return false;
      });
  } else {
    console.error("Event Id was not passed");
    return false;
  }
});
