export const SPOTIFY_API_BASEURL = "https://api.spotify.com/v1";

export const CORS_ALLOWED_ORIGINS = "*";

export const createSpotifyAPITrackURL = (songId: string) =>
  `${SPOTIFY_API_BASEURL}/tracks/${songId}`;

export const createSpotifyAPICreatePlaylistURL = (userId: string) =>
  `${SPOTIFY_API_BASEURL}/users/${userId}/playlists`;

export const createSpotifyAPIAddToPlaylistURL = (playlistId: string) =>
  `${SPOTIFY_API_BASEURL}/playlists/${playlistId}/tracks`;

export const createSpotifyAPIReorderPlaylistURL = (playlistId: string) =>
  `${SPOTIFY_API_BASEURL}/playlists/${playlistId}/tracks`;

export const createSpotifyAPIUserProfileURL = () => `${SPOTIFY_API_BASEURL}/me`;

export const createSpotifyAPIUserMyPlaylistsURL = () => `${SPOTIFY_API_BASEURL}/me/playlists`;

export const EVENT_COLLECTION = "Events";

export const SONG_COLLECTION = "Songs";
