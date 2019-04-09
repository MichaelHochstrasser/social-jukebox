export class Event {
  eventId?: string;
  spotifyToken?: string;

  constructor(
    public name: string,
    spotifyToken?: string,
    id?: string,
    playlistId?: string
  ) {
    if (id) {
      this.eventId = id;
    }
    if (spotifyToken) {
      this.spotifyToken = spotifyToken;
    }
  }
}
