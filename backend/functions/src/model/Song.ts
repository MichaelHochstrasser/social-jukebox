import { Voter } from "./Voter";

export class Song {
  constructor(
    public eventId: string,
    public songId: string = "spotify:track:6rqhFgbbKwnb9MLmUQDhG6",
    public dateAdded: Date = new Date(),
    public isPlaying: boolean = false,
    public voters: Voter[] = [],
    public voteCount: number = 0
  ) {}
}
