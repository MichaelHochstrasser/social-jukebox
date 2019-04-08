import * as functions from "firebase-functions";

import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  firestoreHelper
    .getEvent("lfBoWpMRpm19kDTZp7P1")
    .then((result: Event | void) => {
      response.send(result ? result.name : "nope");
    })
    .catch(err => {
      response.send("Error");
    });
});
