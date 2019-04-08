export class Event {
  eventId?: string;

  constructor(public name: string, public spotifyToken?: string, id?: string) {
    if (id) {
      this.eventId = id;
    }
  }
}
