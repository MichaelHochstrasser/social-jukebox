import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

import { SpotifyTrack } from "../model/SpotifyTrack";
import { stringify } from "querystring";

import {
  createSpotifyAPITrackURL,
  createSpotifyAPICreatePlaylistURL,
  createSpotifyAPIUserProfileURL,
  createSpotifyAPIAddToPlaylistURL,
  createSpotifyAPIUserMyPlaylistsURL
} from "./constants";

import {FireStoreHelper} from "./FirestoreHelper";

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
  constructor(private accessToken?: string, private refreshToken?: string, private validUntil?: number) {}

  async getSongInfo(songId: string): Promise<SpotifyTrack | void> {
    if (this.accessToken) {
      await this.refreshAccessToken();
    }else {
      throw new Error("Spotify token not set!");
    }

    const requestUrl = createSpotifyAPITrackURL(songId);
    return axios
      .get(requestUrl, createHeader(this.accessToken))
      .then((response: any) => {
        if (response.data) {
          return {
            id: response.data.id as string,
            title: response.data.name as string,
            duration_ms: response.data.duration_ms as number,
            artist: response.data.artists
              .map((artist: { name: string }) => artist.name)
              .join(",") as string,
            popularity: response.data.popularity as number,
            image: response.data.album.images[0].url as string
          } as SpotifyTrack;
        } else {
          throw new Error("No data returned!");
        }
      })
      .catch(err => {
        throw err;
      });
  }

  async getUserId(): Promise<string> {
    if (this.accessToken) {
      await this.refreshAccessToken();
    }else {
      throw new Error("Spotify token not set!");
    }

    const requestUrl = createSpotifyAPIUserProfileURL();

    return axios
      .get(requestUrl, createHeader(this.accessToken))
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
  }

  async checkSpotifyConnection(): Promise<boolean>{
    if (!this.accessToken) {
      return false;
    }
    const requestUrl = createSpotifyAPIUserMyPlaylistsURL();
    let status = false;
    await axios.get(requestUrl, createHeader(this.accessToken)).then(() => {
      status = true;
    }).catch(() => {
      status = false;
    });
    return status;
  }

  async createPlaylist(name: string): Promise<string> {
    if (this.accessToken) {
      await this.refreshAccessToken();
    }else {
      throw new Error("Spotify token not set!");
    }

    return this.getUserId()
      .then(userId => {
        if (userId) {
          const playlistRequestUrl = createSpotifyAPICreatePlaylistURL(userId);

          if (!this.accessToken) {
            throw new Error("Spotify token not set!");
          }

          return axios
            .post(
              playlistRequestUrl,
              {
                name,
                public: true
              },
              createHeader(this.accessToken, "application/json")
            )
            .then((response: any) => {
              if (response.data && response.data.id) {
                return response.data.id;
              } else {
                throw new Error("Failed to create Playlist!");
              }
            })
            .catch(err => {
              throw err;
            });
        } else {
          throw new Error("Missing User-ID!");
        }
      })
      .catch(err => {
        throw err;
      });
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<boolean> {
    const addToPlaylistRequestUrl = createSpotifyAPIAddToPlaylistURL(
      playlistId
    );

    if (this.accessToken) {
      await this.refreshAccessToken();
    }else {
      throw new Error("Spotify token not set!");
    }

    return axios
      .post(
        addToPlaylistRequestUrl,
        {
          uris: [`spotify:track:${songId}`]
        },
        createHeader(this.accessToken, "application/json")
      )
      .then((response: any) => {
        if (response.status === 201 || response.status === 200) {
          return true;
        } else {
          throw new Error("Failed to Add Song to Playlist!");
        }
      })
      .catch(err => {
        throw err;
      });
  }

  reorderSongsOnPlaylist() {}

  async getSpotifySearchResult(searchTerm: string, searchType: string): Promise<AxiosResponse> {
    if (this.accessToken) {
      await this.refreshAccessToken();
    }else {
      throw new Error("Spotify token not set!");
    }

    return axios.get(
      "https://api.spotify.com/v1/search",
      createHeader(this.accessToken, "", {
        q: searchTerm,
        type: searchType,
        market: "from_token"
      })
    );
  }

  async refreshAccessToken(force: boolean = false){
    if (!this.refreshToken){
      throw new Error("no refresh token to request new access token");
    }
    if (force || this.hasAccessTokenExpired()){
      const oldAccessToken = this.accessToken;

      const authorizationString = Buffer.from("68fd4d58904748c7bc63c038fa3a5f01:4b10c006070340f09fac901f138b56ea").toString('base64');
      const postData = stringify({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken
      });
      const header = {
        Authorization: `Basic ${authorizationString}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length
      };
      const config: AxiosRequestConfig = {
        url: "https://accounts.spotify.com/api/token",
        method: "POST",
        data: postData,
        headers: header
      };
      await axios.request(config)
        .then(response => {
          if(response.data && response.data.access_token){
            const fireStoreHelper = new FireStoreHelper();
            this.accessToken = response.data.access_token;
            const expiresIn = response.data.expires_in;
            this.validUntil = Date.now() + expiresIn * 1000;
            if(oldAccessToken && this.accessToken && this.refreshToken){
              fireStoreHelper.updateTokens(oldAccessToken, this.accessToken, this.refreshToken, this.validUntil);
            }
          }
        })
        .catch(err => {
          throw err;
        });
    }
  }

  private hasAccessTokenExpired(): boolean {
    if (!this.validUntil){
      return true;
    }
    if (Date.now() > this.validUntil - 100000){
      return true;
    }
    return false;
  }
}
