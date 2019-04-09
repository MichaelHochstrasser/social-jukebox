import createEventFunction from "./createevent";
import getSpotifyAccessTokenFunction from "./getSpotifyAccessToken";
import searchFunction from "./search";
import addSongFunction from "./addsong";
import voteFunction from "./vote";

export const getSpotifyAccessToken = getSpotifyAccessTokenFunction;
export const createEvent = createEventFunction;
export const search = searchFunction;
export const addSong = addSongFunction;
export const vote = voteFunction;
