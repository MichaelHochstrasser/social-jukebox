import { Voter } from "./Voter";

export class Song {
  constructor(
    public eventId: string,
    public songId: string,
    public dateAdded: Date,
    public isPlaying: boolean,
    public voters: Voter[],
    public voteCount: number
  ) {}
}
