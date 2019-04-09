import * as functions from "firebase-functions";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { checkParamsExist } from "../shared/PropertyChecker";

import { Event } from "../model/Event";

const fireStoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  console.log("register new token");
  const body = request.body;
  if (checkParamsExist(body, ["eventId", "spotifyToken"])) {
    if (request.method.toLowerCase() !== "post") {
      response.status(400);
      return;
    }

    fireStoreHelper
      .getEvent(body["eventId"])
      .then((event: Event | void) => {
        console.log("get event with id ", body["eventId"]);
        if (!event) {
          const s = "Event with id " + body["eventId"] + " not found";
          console.error(s);
          response.status(400);
          return;
        }
        console.log("got event", event);
        event.spotifyToken = body["spotifyToken"];
        fireStoreHelper
          .createOrUpdateEvent(event)
          .then((updatedEvent: Event | void) => {
            if (!updatedEvent) {
              const s = "Error while updating the event";
              console.error(s);
              response.status(400);
              return;
            }
            console.log(`event "${updatedEvent.name}" updated`);
            response.status(200);
          })
          .catch(err => {
            throw err;
          });
      })
      .catch((err: Error) => {
        response.status(500).send(err.message);
      });
  }
  response.send();
});
