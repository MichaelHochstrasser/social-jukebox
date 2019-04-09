import { Voter } from "./Voter";

export class Song {
  constructor(
    public eventId: string,
    public songId: string = "6rqhFgbbKwnb9MLmUQDhG6",
    public title: string = "",
    public artist: string = "",
    public dateAdded: Date = new Date(),
    public isPlaying: boolean = false,
    public voters: Voter[] = [],
    public voteCount: number = 0
  ) {}
}
