import axios, { AxiosRequestConfig } from "axios";

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

  getSongInfo(
    songId: string
  ): Promise<{ title: string; artist: string } | void> {
    const requestUrl = createSpotifyAPITrackURL(songId);

    if (this.spotifyToken) {
      return axios
        .get(requestUrl, createHeader(this.spotifyToken))
        .then((response: any) => {
          console.log(response);
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
