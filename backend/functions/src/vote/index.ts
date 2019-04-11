import * as functions from "firebase-functions";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";

import { Song } from "../model/Song";
import { Event } from "../model/Event";
import { HTTP_METHODS } from "../model/CorsConfig";
import {SpotifyHelper} from "../shared/SpotifyApiHelper";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";
  const voteAttr = "vote";
  const voterAttr = "sessionId";
  let currentEvent: Event;
  let previousPlaylist: Song[] = [];
  let currentPlaylist: Song[] = [];

  corsEnabledFunctionAuth(request, response, {
    methods: [HTTP_METHODS.POST]
  });

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (
    request.method !== "POST" ||
    !request.body ||
    !checkParamsExist(request.body, [
      songIdAttr,
      eventIdAttr,
      voteAttr,
      voterAttr
    ]) ||
    (parseInt(request.body[voteAttr], 10) !== 1 &&
      parseInt(request.body[voteAttr], 10) !== -1)
  ) {
    response.status(400).send("Bad Request!");
    return;
  }

  firestoreHelper
    .getEvent(request.body[eventIdAttr])
    .then((event: Event | void) => {
      if (!event || event.eventId !== request.body[eventIdAttr]) {
        throw new Error("Event not found");
      } else {
          currentEvent = event;
          return firestoreHelper.getPlaylist(event.eventId || '');
      }
    })
      .then((playlist: Song[] |void ) => {
          if(playlist) {
            previousPlaylist = playlist;
          }
          return firestoreHelper.getSong(request.body[songIdAttr], request.body[eventIdAttr]);
      })
    .then((song: Song | null) => {
      if (
        !song ||
        song.spotifySongId !== request.body[songIdAttr] ||
        song.eventId !== request.body[eventIdAttr]
      ) {
        throw new Error("Song not found or not consistent");
      } else if (
       song.voters &&
       song.voters.findIndex(voter => voter === request.body[voterAttr]) !== -1
     ) {
       // Voter has already voted
       response.status(200).json({ status: "already_voted" });
       return;
     } else {
        return firestoreHelper
          .addOrUpdateSong({
            ...song,
            voters: [...song.voters, request.body[voterAttr]],
            voteCount: song.voteCount + parseInt(request.body[voteAttr])
          } as Song)
          .then((updatedSong: Song | void) => {
            if (updatedSong) {
                return firestoreHelper.getPlaylist(song.eventId);
            } else {
              throw new Error("Error while updating the song");
            }
          })
          .then((playlist: Song[] | void) => {
              if(playlist) {
                  currentPlaylist = playlist;
              }
            if(!isInOrder(currentPlaylist, previousPlaylist)) {
                const songToMove = previousPlaylist.findIndex(item => item.spotifySongId === song.spotifySongId);
                let insertBefore = currentPlaylist.findIndex(item => item.spotifySongId === song.spotifySongId);
                // because of insertion *before* song we need to add one in case song needs to be at the end!
                insertBefore = insertBefore === currentPlaylist.length - 1 ? insertBefore + 1 : insertBefore;
                const spotifyHelper = new SpotifyHelper(currentEvent.spotifyToken, currentEvent.refreshToken, currentEvent.validUntil);
                console.log('song to move: ' + songToMove);
                console.log('insert Before:' + insertBefore);
                spotifyHelper.reorderSongsOnPlaylist(song.playlistId, songToMove, insertBefore)
                    .then(_ => response.status(200).send({status: "success"}))
                    .catch(err => {
                        console.error(err);
                        response.status(500).send({status: "could not update spotify order"})
                    })
            }
        })
          .catch(err => {
            throw err;
          });
      }
    })
    .catch((msg: Error) => {
      response.status(500).send(msg.message);
    });
});

function isInOrder(currentPlaylist: Song[], previousPlaylist: Song[]) : boolean {
    return currentPlaylist.every((item, index) => previousPlaylist[index].spotifySongId === item.spotifySongId)
}