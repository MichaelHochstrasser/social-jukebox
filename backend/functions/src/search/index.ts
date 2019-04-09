import * as functions from "firebase-functions";
import {checkParamsExist} from "../shared/propertychecker";
import {FireStoreHelper} from "../shared/FirestoreHelper";
import {Event} from "../model/Event";
import {SearchType} from "../model/SearchType";
import {createHeader} from "../shared/SpotifyApiHelper";

const firestoreHelper = new FireStoreHelper();
const axios = require('axios');

export default functions.https.onRequest((request, response) => {
    const eventIdParam: string = 'eventId';
    const searchTermParam: string = 'term';
    const searchTypeParam: string = 'type';

    if (request.method != 'GET' || !request.query || !checkParamsExist(request.query, [eventIdParam, searchTermParam])) {
        response.status(400).send("Bad Request!");
        return;
    }

    const eventId = request.query[eventIdParam];
    const searchTerm = request.query[searchTermParam];
    const searchType = request.query[searchTypeParam] || SearchType.TRACK;

    firestoreHelper.getEvent(eventId)
        .then((event: Event | void) => {
            if (event) {
                if (!event.spotifyToken) {
                    response.status(400).send("Spotify Token Required!");
                    return;
                }
                getSpotifySearchResult(searchTerm, searchType, event.spotifyToken)
                    .then((res: any) => response.status(200).send(mapSpotifySearchResult(res.data)))
                    .catch((err: any) => {
                        console.error(err.response);
                        response.status(500).send(err.response.statusText)
                    })
            }
        })
        .catch((err) => response.status(500).send(err));

});

function getSpotifySearchResult(searchTerm: string, searchType: string, apiToken: string) {
    return axios.get('https://api.spotify.com/v1/search', createHeader(apiToken, {
        q: searchTerm,
        type: searchType
    }));
}

function mapSpotifySearchResult(res: any) {
    return res;
}
