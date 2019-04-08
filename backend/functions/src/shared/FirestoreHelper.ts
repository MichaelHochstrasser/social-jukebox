import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
  Firestore,
  CollectionReference,
  DocumentReference,
  WriteResult,
  DocumentSnapshot
} from "@google-cloud/firestore";

admin.initializeApp(functions.config().firebase);

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

  deleteEvent(eventId: string) {}

  getEvent(eventId: string): Promise<Event | void> {
    const docRef: DocumentReference = this.getEventDocument(eventId);

    return docRef
      .get()
      .then((result: DocumentSnapshot) => {
        return {
          ...result.data(),
          eventId: result.id
        } as Event;
      })
      .catch(err => {
        console.log(err);
      });
  }

  addSong(song: Song) {}

  updateSong(song: Song) {}

  removeSong(songId: string) {}

  getSong(songId: string) {}
}
