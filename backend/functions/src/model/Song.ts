import { Voter } from "./Voter";

import { SpotifyTrack } from "./SpotifyTrack";
import * as admin from "firebase-admin";
import Timestamp = admin.firestore.Timestamp;

export class Song implements SpotifyTrack {
  public get id() {
    return this.spotifySongId;
  }

  constructor(
    public eventId: string,
    public playlistId: string,
    public spotifySongId: string = "6rqhFgbbKwnb9MLmUQDhG6",
    public title: string = "",
    public artist: string = "",
    public duration_ms: number = 0,
    public popularity: number = 0,
    public image: string = "",
    public dateAdded: Timestamp = Timestamp.now(),
    public isPlaying: boolean = false,
    public voters: Voter[] = [],
    public voteCount: number = 0
  ) {}
}
