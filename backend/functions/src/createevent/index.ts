import * as functions from "firebase-functions";

import { Event } from "../model/Event";
import { HTTP_METHODS } from "../model/CorsConfig";

import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  corsEnabledFunctionAuth(request, response, {
    methods: [HTTP_METHODS.POST]
  });

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

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
    .then((event: Event | void) => {
      if (event) {
        response.status(200).send(event);
      } else {
        throw Error("Could not persist event");
      }
    })
    .catch(err => response.status(500).send(err.message));
});
