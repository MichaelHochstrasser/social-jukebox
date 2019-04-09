import { Voter } from "./Voter";

import { SpotifyTrack } from "./SpotifyTrack";

export class Song implements SpotifyTrack {
  public get id() {
    return this.songId;
  }

  constructor(
    public eventId: string,
    public songId: string = "6rqhFgbbKwnb9MLmUQDhG6",
    public name: string = "",
    public artist: string = "",
    public duration_ms: number = 0,
    public popularity: number = 0,
    public image: string = "",
    public dateAdded: Date = new Date(),
    public isPlaying: boolean = false,
    public voters: Voter[] = [],
    public voteCount: number = 0
  ) {}
}
