import createEventFunction from "./createevent";
import getSpotifyAccessTokenFunction from "./getSpotifyAccessToken";
import checkSpotifyConnectionFunction from "./checkspotifyconnection";
import searchFunction from "./search";
import addSongFunction from "./addsong";
import voteFunction from "./vote";
import reorderFinishedSongFunction from "./updateplaylist";

export const getSpotifyAccessToken = getSpotifyAccessTokenFunction;
export const checkSpotifyConnection = checkSpotifyConnectionFunction;
export const createEvent = createEventFunction;
export const search = searchFunction;
export const addSong = addSongFunction;
export const vote = voteFunction;
export const resetFinishedSong = reorderFinishedSongFunction;
