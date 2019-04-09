import * as functions from "firebase-functions";
import { checkParamsExist } from "../shared/propertychecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const nameAttribute: string = "name";

  if (
    request.method !== "POST" ||
    !request.body ||
    !checkParamsExist(request.body, [nameAttribute])
  ) {
    response.status(400).send("Bad Request!");
    return;
  }

  return firestoreHelper
    .createOrUpdateEvent(new Event(request.body[nameAttribute]))
    .then(() => response.status(200).send())
    .catch(msg => response.status(500).send(msg));
});
