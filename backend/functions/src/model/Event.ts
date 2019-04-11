export class Event {
  eventId?: string;
  spotifyToken?: string;
  refreshToken?: string;
  validUntil?: number;
  playlistId?: string;

  constructor(
    public name: string,
    public userId: string,
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
    if (playlistId) {
      this.playlistId = playlistId;
    }
  }
}
