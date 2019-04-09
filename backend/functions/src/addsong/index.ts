import * as functions from "firebase-functions";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { SpotifyHelper } from "../shared/SpotifyApiHelper";

// import { Song } from "../model/Song";
import { Event } from "../model/Event";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const songIdAttr = "songId";
  const eventIdAttr = "eventId";

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
        const spotifyHelper = new SpotifyHelper(event.spotifyToken);
        spotifyHelper
          .getSongInfo(request.body[songIdAttr])
          .then((result: { title: string; artist: string } | void) => {
            response.status(200).send(result);
          })
          .catch((err: Error) => {
            response.status(500).send(err.message);
          });
        /* firestoreHelper
          .addOrUpdateSong(
            new Song(request.body[eventIdAttr], request.body[songIdAttr])
          )
          .then(() => response.status(200).send())
          .catch(msg => response.status(500).send(msg)); */
      } else {
        response.status(500).send("Event not found.");
      }
    })
    .catch(msg => response.status(500).send(msg));
});
