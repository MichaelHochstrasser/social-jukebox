import axios, { AxiosRequestConfig } from "axios";

import { SpotifyTrack } from "../model/SpotifyTrack";

import { createSpotifyAPITrackURL } from "./constants";

export function createHeader(
  token: string,
  params?: { [key: string]: string | number }
): AxiosRequestConfig {
  const options: AxiosRequestConfig = {
    headers: { Authorization: "Bearer " + token }
  };

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

  getSpotifySearchResult(searchTerm: string, searchType: string) {
    if(this.spotifyToken) {
      return axios.get('https://api.spotify.com/v1/search', createHeader(this.spotifyToken, {
        q: searchTerm,
        type: searchType,
        market: 'from_token'
      }));
    } else {
      throw new Error("No spotify token!")
    }
  }

}
