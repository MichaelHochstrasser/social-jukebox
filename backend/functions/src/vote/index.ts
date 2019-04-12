import * as functions from "firebase-functions";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import {
  corsEnabledFunctionAuth,
  publishEventReorderMessage
} from "../shared/CloudFunctionsUtils";

import { Song } from "../model/Song";
import { Event } from "../model/Event";
import { HTTP_METHODS } from "../model/CorsConfig";
import { Voter } from "../model/Voter";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";
  const voteAttr = "vote";
  const voterAttr = "sessionId";

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
        return firestoreHelper.getSong(
          request.body[songIdAttr],
          request.body[eventIdAttr]
        );
      }
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
        song.voters.findIndex(
          voter =>
            voter.sessionId === request.body[voterAttr] &&
            voter.vote === parseInt(request.body[voteAttr], 10)
        ) !== -1
      ) {
        // Voter has already voted
        response.status(200).json({ status: "already_voted" });
        return;
      } else {
        return firestoreHelper
          .addOrUpdateSong({
            ...song,
            voters:
              song.voters &&
              song.voters.findIndex(
                voter => voter.sessionId === request.body[voterAttr]
              ) !== -1
                ? [
                    ...song.voters.map((voter: Voter) =>
                      voter.sessionId === request.body[voterAttr]
                        ? { ...voter, vote: request.body[voteAttr] }
                        : voter
                    )
                  ]
                : [
                    ...song.voters,
                    {
                      sessionId: request.body[voterAttr],
                      vote: parseInt(request.body[voteAttr], 10)
                    }
                  ],
            voteCount:
              song.voters &&
              song.voters.findIndex(
                voter => voter.sessionId === request.body[voterAttr]
              ) !== -1
                ? song.voteCount + parseInt(request.body[voteAttr], 10) * 2
                : song.voteCount + parseInt(request.body[voteAttr], 10)
          } as Song)
          .then((updatedSong: Song | void) => {
            if (updatedSong) {
              publishEventReorderMessage(request.body[eventIdAttr])
                .then(() => {
                  response.status(200).send();
                  return;
                })
                .catch(err => {
                  throw err;
                });
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
