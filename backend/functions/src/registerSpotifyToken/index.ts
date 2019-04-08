import * as functions from "firebase-functions";
import {FireStoreHelper} from "../shared/FirestoreHelper";
import {checkParamsExist} from "../shared/PropertyChecker";

const fireStoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
    console.log("register new token");
    const body = request.body;
    if (checkParamsExist(body, ["eventId", "spotifyToken"])){
        if(request.method.toLowerCase() != 'post'){
            response.status(400);
            return;
        }

        fireStoreHelper.getEvent(body["eventId"]).then(event => {
            console.log("get event with id ", body["eventId"]);
            if(event == null){
                const s = "Event with id " + body["eventId"] + " not found";
                console.error(s);
                response.status(400);
                return;
            }
            console.log("got event", event);
            event.spotifyToken = body["spotifyToken"];
            fireStoreHelper.createOrUpdateEvent(event).then(event => {
                if (event == null){
                    const s = "Error while updating the event";
                    console.error(s);
                    response.status(400);
                    return;
                }
                console.log(`event "${event.name}" updated`);
                response.status(200);
            });
        });
    }
    response.send();
});