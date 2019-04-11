import * as functions from "firebase-functions";

import { SpotifyTrack } from "../model/SpotifyTrack";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { SpotifyHelper } from "../shared/SpotifyApiHelper";

import { Song } from "../model/Song";
import { Event } from "../model/Event";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";
import { HTTP_METHODS } from "../model/CorsConfig";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";

  corsEnabledFunctionAuth(request, response, {
    methods: [HTTP_METHODS.POST]
  });

  if (request.method === "OPTIONS") {
    return;
  }

  if (
    request.method !== "POST" ||
    !request.body ||
    !checkParamsExist(request.body, [songIdAttr, eventIdAttr])
  ) {
    response.status(400).send("Bad Request!");
    return;
  }

  firestoreHelper
    .getEvent(request.body[eventIdAttr])
    .then((event: Event | void) => {
      if (event && event.eventId === request.body[eventIdAttr]) {
        const spotifyHelper = new SpotifyHelper(
          event.spotifyToken,
          event.refreshToken,
          event.validUntil
        );
        spotifyHelper
          .getSongInfo(request.body[songIdAttr])
          .then((result: SpotifyTrack | void) => {
            if (!result) {
              response.status(500).send("Song not found on Spotify!");
            } else {
              firestoreHelper
                .addOrUpdateSong(
                  new Song(
                    request.body[eventIdAttr],
                    event.playlistId || "",
                    request.body[songIdAttr],
                    result.title,
                    result.artist,
                    result.duration_ms,
                    result.popularity,
                    result.image
                  ),
                  event.spotifyToken,
                  event.refreshToken,
                  event.validUntil
                )
                .then(() => response.status(200).send())
                .catch((err: Error) => response.status(500).send(err.message));
            }
          })
          .catch((err: Error) => {
            response.status(500).send(err.message);
          });
      } else {
        response.status(500).send("Event not found.");
      }
    })
    .catch(msg => response.status(500).send(msg));
});
