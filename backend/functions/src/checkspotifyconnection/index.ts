import * as functions from "firebase-functions";
import {SpotifyHelper} from "../shared/SpotifyApiHelper";
import {FireStoreHelper} from "../shared/FirestoreHelper";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
    const eventId = request.query["eventId"];
    if(!eventId){
        response.status(400).send("no eventId given. Please provide the eventId as query parameter (?eventId=XYZ");
        return;
    }
    firestoreHelper.getEvent(eventId)
        .then((event) => {
            if(!event){
                response.status(400).send(`event with id "${eventId}" not found.`);
                return;
            }
            const spotifyHelper = new SpotifyHelper(event.spotifyToken, event.refreshToken, event.validUntil);
            spotifyHelper.checkSpotifyConnection().then(status => {
                if(status){
                    response.status(200).send();
                    return;
                }else{
                    response.status(400).send();
                    return;
                }
            })
        .catch((err) => {
            response.status(500).send(err);
            return;
        });
    })
});
