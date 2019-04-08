import * as functions from "firebase-functions";

import { checkParamsExist } from "../shared/propertychecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";

import { Song } from "../model/Song";
import { Event } from "../model/Event";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";
  const voteAttr = "vote";
  const voterAttr = "sessionId";

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
        return firestoreHelper.getSong(request.body[songIdAttr]);
      }
    })
    .then((song: Song | void) => {
      if (
        !song ||
        song.songId !== request.body[songIdAttr] ||
        song.eventId !== request.body[eventIdAttr]
      ) {
        throw new Error("Song not found or not consistent");
      } else if (
        song.voters &&
        song.voters.findIndex(voter => voter === request.body[voterAttr]) !== -1
      ) {
        throw new Error("Voter has already voted!");
      } else {
        return song;
      }
    })
    .then((song: Song) => {
      firestoreHelper
        .addOrUpdateSong({
          ...song,
          voters: [...song.voters, request.body[voterAttr]],
          voteCount: song.voteCount + parseInt(request.body[voteAttr])
        } as Song)
        .then((updatedSong: Song | void) => {
          if (updatedSong) {
            response.status(200).send();
          } else {
            throw new Error("Error while updating the song");
          }
        })
        .catch(err => {
          throw err;
        });
    })
    .catch((msg: Error) => {
      response.status(500).send(msg.message);
    });
});
