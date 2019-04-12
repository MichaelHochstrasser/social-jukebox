import * as functions from "firebase-functions";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";
import {
  corsEnabledFunctionAuth,
  publishEventReorderMessage
} from "../shared/CloudFunctionsUtils";
import { HTTP_METHODS } from "../model/CorsConfig";
import { checkParamsExist } from "../shared/PropertyChecker";
import { Song } from "../model/Song";
import * as admin from "firebase-admin";

const Timestamp = admin.firestore.Timestamp;

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const eventIdParam: string = "eventId";
  const songIdParam: string = "songId";

  corsEnabledFunctionAuth(request, response, {
    methods: [HTTP_METHODS.GET]
  });

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (
    request.method !== "GET" ||
    !request.query ||
    !checkParamsExist(request.query, [eventIdParam, songIdParam])
  ) {
    response.status(400).send("Bad Request!");
    return;
  }

  const eventId = request.query[eventIdParam];
  const songId = request.query[songIdParam];

  let nextTrack: Song;
  firestoreHelper
    .getEvent(eventId)
    .then((event: Event | void) => {
      if (event) {
        if (!event.spotifyToken) {
          response.status(400).send("Spotify Token Required!");
          return;
        }

        firestoreHelper
          .getPlaylist(eventId)
          .then((playlist: Song[] | void) => {
            console.log(playlist);
            console.log(event);
            console.log(event.playlistId);
            if (playlist && event && event.playlistId) {
              nextTrack = playlist[1];
              firestoreHelper
                .getSong(songId, eventId)
                .then(song => {
                  if (!song) {
                    return;
                  }
                  firestoreHelper
                    .addOrUpdateSong({
                      ...song,
                      ...{
                        voteCount: 0,
                        voters: [{}],
                        dateAdded: Timestamp.now()
                      }
                    } as Song)
                    .then(() => {
                      firestoreHelper
                        .addOrUpdateSong({
                          ...nextTrack,
                          ...{
                            voteCount: 99999999999,
                            voters: [{}]
                          }
                        } as Song)
                        .then(() => {
                          publishEventReorderMessage(eventId)
                            .then(() => {
                              response.status(200).send();
                              return;
                            })
                            .catch(err => {
                              throw err;
                            });
                        })
                        .catch((err: any) => {
                          console.error(err.response);
                          response.status(500).send("Internal Error");
                        });
                    })
                    .catch((err: any) => {
                      console.error(err.response);
                      response.status(500).send("Internal Error");
                    });
                })
                .catch((err: any) => {
                  console.error(err.response);
                  response.status(500).send("Internal Error");
                });
            }
          })
          .catch((msg: Error) => {
            response.status(500).send(msg.message);
          });
      }
    })
    .catch(err => response.status(500).send(err));
});
