import { Voter } from "./Voter";

export class Song {
  constructor(
    public eventId: string,
    public dateAdded: Date = new Date(),
    public isPlaying: boolean = false,
    public voters: Voter[] = [],
    public voteCount: number = 0,
    public songId?: string
  ) {}
}
