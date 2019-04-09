import * as functions from "firebase-functions";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";

import { Song } from "../model/Song";
import { Event } from "../model/Event";
import { HTTP_METHODS } from "../model/CorsConfig";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";
  const voteAttr = "vote";
  const voterAttr = "sessionId";

  if (request.method === "OPTIONS") {
    corsEnabledFunctionAuth(request, response, {
      methods: [HTTP_METHODS.POST]
    });
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
              response.status(200).json({ status: "success" });
            } else {
              throw new Error("Error while updating the song");
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
