import * as functions from "firebase-functions";
import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";
import { HTTP_METHODS } from "../model/CorsConfig";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  if (request.method === "OPTIONS") {
    corsEnabledFunctionAuth(request, response, {
      methods: [HTTP_METHODS.POST]
    });
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
      if(event) {
        response.status(200).send(event);
      } else {
        throw Error("Could not persist event");
      }
    })
    .catch(msg => response.status(500).send(msg));
});
