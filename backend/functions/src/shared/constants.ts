export const SPOTIFY_API_BASEURL = "https://api.spotify.com/v1";

export const CORS_ALLOWED_ORIGINS = "*";

export const createSpotifyAPITrackURL = (songId: string) =>
  `${SPOTIFY_API_BASEURL}/tracks/${songId}`;
