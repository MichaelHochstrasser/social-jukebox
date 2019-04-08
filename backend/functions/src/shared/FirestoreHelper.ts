import admin from "./admin";

import {
  Firestore,
  CollectionReference,
  DocumentReference,
  WriteResult,
  DocumentSnapshot
} from "@google-cloud/firestore";

import { Event } from "../model/Event";
import { Song } from "../model/Song";

export class FireStoreHelper {
  private firestore: Firestore;

  constructor() {
    this.firestore = admin.firestore();
  }

  private getEventDocument(eventId?: string): DocumentReference {
    const collection: CollectionReference = this.firestore.collection("Events");

    return eventId ? collection.doc(eventId) : collection.doc();
  }

  createOrUpdateEvent(event: Event): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(event.eventId);

    return docRef
      .set({ ...event })
      .then((result: WriteResult) => {
        return {
          ...event,
          eventId: docRef.id
        } as Event;
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteEvent(eventId: string): Promise<boolean> {
    const docRef: DocumentReference = this.getEventDocument(eventId);

    return docRef
      .delete()
      .then((result: WriteResult) => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getEvent(eventId: string): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(eventId);

    return docRef
      .get()
      .then((result: DocumentSnapshot) => {
        if (result.exists) {
          return {
            ...result.data(),
            eventId: result.id
          } as Event;
        }
        return;
      })
      .catch(err => {
        console.log(err);
      });
  }

  private getSongDocument(songId?: string): DocumentReference {
    const collection: CollectionReference = this.firestore.collection("Songs");

    return songId ? collection.doc(songId) : collection.doc();
  }

  addOrUpdateSong(song: Song): Promise<Song | void> {
    const docRef: DocumentReference = this.getSongDocument(song.songId);

    return docRef
      .set({ ...song })
      .then((result: WriteResult) => {
        return {
          ...song,
          songId: docRef.id
        } as Song;
      })
      .catch(err => {
        console.log(err);
      });
  }

  removeSong(songId: string) {
    const docRef: DocumentReference = this.getSongDocument(songId);

    return docRef
      .delete()
      .then((result: WriteResult) => true)
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getSong(songId: string) {
    const docRef: DocumentReference = this.getSongDocument(songId);

    return docRef
      .get()
      .then((result: DocumentSnapshot) => {
        if (result.exists) {
          return {
            ...result.data(),
            songId: result.id
          } as Song;
        }
        return;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
