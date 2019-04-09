import * as functions from "firebase-functions";
import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";

const querystring = require("querystring");
const r = require("request");
const fireStoreHelper = new FireStoreHelper();

//test: GET https://accounts.spotify.com/authorize?client_id=68fd4d58904748c7bc63c038fa3a5f01&response_type=code&redirect_uri=http://localhost:5000/social-jukebox-zuehlke/us-central1/getSpotifyAccessToken&scope=user-read-private%20playlist-modify-public%20playlist-modify-private&state=lfBoWpMRpm19kDTZp7P1
export default functions.https.onRequest((request, response) => {
  console.log("getSpotifyAccessToken");
  const query = request.query;
  //step 2
  if (!checkParamsExist(query, ["code", "state"])) {
    response.status(500).send("code or state not provided.");
    return;
  }

  console.log("got new code from request from spotify");

  const postData = querystring.stringify({
    grant_type: "authorization_code",
    code: query["code"],
    redirect_uri:
      "http://localhost:5000/social-jukebox-zuehlke/us-central1/getSpotifyAccessToken",
    client_id: "68fd4d58904748c7bc63c038fa3a5f01",
    client_secret: "4b10c006070340f09fac901f138b56ea"
  });

  const req = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length
    },
    uri: "https://accounts.spotify.com/api/token",
    method: "POST",
    body: postData
  };

  r(req, function(err: any, res: any, body: any) {
    console.log("try to get a new access token from spotify");
    const jsonBody = JSON.parse(body);
    const accessToken = jsonBody["access_token"];
    const eventId = query["state"];
    console.log(accessToken);
    if (accessToken && accessToken.length > 0) {
      console.log("got a new access token from spotify");
      console.log("add the accessToken to the event with id", query["state"]);

      fireStoreHelper
        .getEvent(eventId)
        .then((event: Event | void) => {
          if (!event) {
            const s = `Event with id ${eventId} not found`;
            console.error(s);
            response.status(400);
            return;
          }
          console.log(`event "${event.name}" loaded`);
          event.spotifyToken = accessToken;
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
              response.redirect(`http://localhost:3000/event/${eventId}`);
              return;
            })
            .catch(err => {
              throw err;
            });
        })
        .catch((err: Error) => {
          response.status(500).send(err.message);
        });
    } else {
      response.status(500).send("Invalid access token.");
    }
  });
});
