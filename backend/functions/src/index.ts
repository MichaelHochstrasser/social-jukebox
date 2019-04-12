import createEventFunction from "./createevent";
import getSpotifyAccessTokenFunction from "./getSpotifyAccessToken";
import checkSpotifyConnectionFunction from "./checkspotifyconnection";
import searchFunction from "./search";
import addSongFunction from "./addsong";
import voteFunction from "./vote";
import reorderFunction from "./reorderevent";
import reorderFinishedSongFunction from "./updateplaylist";

export const getSpotifyAccessToken = getSpotifyAccessTokenFunction;
export const checkSpotifyConnection = checkSpotifyConnectionFunction;
export const createEvent = createEventFunction;
export const search = searchFunction;
export const addSong = addSongFunction;
export const vote = voteFunction;
export const reorder = reorderFunction;
export const resetFinishedSong = reorderFinishedSongFunction;
