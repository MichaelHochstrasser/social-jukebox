import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export default functions.https.onRequest((request, response) => {
  const db = admin.firestore();

  db.collection("test")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        response.send(`${doc.id}: ${doc.data()}`);
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  console.log("here");
  //response.send("Hello from Firebase!");
});
