import axios, { AxiosRequestConfig } from "axios";

import { SpotifyTrack } from "../model/SpotifyTrack";

import {
  createSpotifyAPITrackURL,
  createSpotifyAPICreatePlaylistURL,
  createSpotifyAPIUserProfileURL
} from "./constants";

export function createHeader(
  token: string,
  contentType?: string,
  params?: { [key: string]: string | number }
): AxiosRequestConfig {
  const options: AxiosRequestConfig = {
    headers: { Authorization: "Bearer " + token }
  };

  if (contentType) {
    options.headers = {
      ...options.headers,
      "content-type": contentType
    };
  }

  if (params) {
    options.params = params;
  }

  return options;
}

export class SpotifyHelper {
  constructor(private spotifyToken?: string) {}

  getSongInfo(songId: string): Promise<SpotifyTrack | void> {
    const requestUrl = createSpotifyAPITrackURL(songId);

    if (this.spotifyToken) {
      return axios
        .get(requestUrl, createHeader(this.spotifyToken))
        .then((response: any) => {
          if (response.data) {
            return {
              id: response.data.id,
              name: response.data.name,
              duration_ms: response.data.duration_ms,
              artist: response.data.artists
                .map((artist: { name: string }) => artist.name)
                .join(","),
              popularity: response.data.popularity,
              image: response.data.album.images[0].url
            } as SpotifyTrack;
          } else {
            throw new Error("No data returned!");
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      throw new Error("No spotify token!");
    }
  }

  getUserId(): Promise<string> {
    const requestUrl = createSpotifyAPIUserProfileURL();

    if (this.spotifyToken) {
      return axios
        .get(requestUrl, createHeader(this.spotifyToken))
        .then((response: any) => {
          if (response.data) {
            return response.data.id;
          } else {
            throw new Error("No data returned!");
          }
        })
        .catch(err => {
          throw err;
        });
    } else {
      throw new Error("Spotify token not set!");
    }
  }

  createPlaylist(name: string): Promise<string> {
    return this.getUserId()
      .then(userId => {
        if (userId) {
          const playlistRequestUrl = createSpotifyAPICreatePlaylistURL(userId);

          if (this.spotifyToken) {
            return axios
              .post(playlistRequestUrl, {}, createHeader(this.spotifyToken)) // TODO: Content-Type, etc...
              .then((response: any) => {
                if (response.data) {
                  return response.data.id; // TODO: Return the playlist-id
                } else {
                  throw new Error("No data returned!");
                }
              })
              .catch(err => {
                throw err;
              });
          } else {
            throw new Error("Spotify token not set!");
          }
        } else {
          throw new Error("Missing User-ID!");
        }
      })
      .catch(err => {
        throw err;
      });
  }

  addSongToPlaylist() {}

  reorderSongsOnPlaylist() {}

  getSpotifySearchResult(searchTerm: string, searchType: string) {
    if (this.spotifyToken) {
      return axios.get(
        "https://api.spotify.com/v1/search",
        createHeader(this.spotifyToken, "", {
          q: searchTerm,
          type: searchType,
          market: "from_token"
        })
      );
    } else {
      throw new Error("No spotify token!");
    }
  }
}