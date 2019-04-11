import * as functions from "firebase-functions";
import { checkParamsExist } from "../shared/PropertyChecker";
import { FireStoreHelper } from "../shared/FirestoreHelper";
import { Event } from "../model/Event";
import { SearchType } from "../model/SearchType";
import { SpotifyHelper } from "../shared/SpotifyApiHelper";
import { SpotifyTrack } from "../model/SpotifyTrack";
import { corsEnabledFunctionAuth } from "../shared/CloudFunctionsUtils";
import { HTTP_METHODS } from "../model/CorsConfig";

const firestoreHelper = new FireStoreHelper();

export default functions.https.onRequest((request, response) => {
  const eventIdParam: string = "eventId";
  const searchTermParam: string = "term";
  const searchTypeParam: string = "type";

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
    !checkParamsExist(request.query, [eventIdParam, searchTermParam])
  ) {
    response.status(400).send("Bad Request!");
    return;
  }

  const eventId = request.query[eventIdParam];
  const searchTerm = request.query[searchTermParam];
  const searchType = request.query[searchTypeParam] || SearchType.TRACK;

  firestoreHelper
    .getEvent(eventId)
    .then((event: Event | void) => {
      if (event) {
        if (!event.spotifyToken) {
          response.status(400).send("Spotify Token Required!");
          return;
        }
        const spotifyHelper = new SpotifyHelper(
          event.spotifyToken,
          event.refreshToken,
          event.validUntil
        );
        spotifyHelper
          .getSpotifySearchResult(searchTerm, searchType)
          .then((res: any) =>
            response.status(200).send(mapToSpotifyTracks(res.data))
          )
          .catch((err: any) => {
            console.error(err.response);
            response.status(500).send("Internal Error");
          });
      }
    })
    .catch(err => response.status(500).send(err));
});

function mapToSpotifyTracks(res: any): SpotifyTrack[] {
  const tracks: SpotifyTrack[] = [];
  if (res && res.tracks && res.tracks.items && res.tracks.items.length > 0) {
    res.tracks.items.forEach((track: any) => {
      const imageIndex: number =
        track.album.images.length > 2
          ? track.album.images.length - 2
          : track.album.images.length - 1;
      tracks.push({
        title: track.name,
        popularity: track.popularity,
        id: track.id,
        duration_ms: track.duration_ms,
        artist: track.artists
          .map((artist: { name: string }) => artist.name)
          .join(","),
        image: track.album.images[imageIndex].url
      });
    });
  }

  return tracks;
}
