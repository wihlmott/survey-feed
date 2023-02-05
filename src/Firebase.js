import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  getFirestore,
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { topics } from "./Config/Config";

const firebaseConfig = {
  apiKey: "AIzaSyDYm39UmovLquw5ujmjfkxmdztNL2RCsWk",
  authDomain: "survey-feed.firebaseapp.com",
  projectId: "survey-feed",
  storageBucket: "survey-feed.appspot.com",
  messagingSenderId: "95536620979",
  appId: "1:95536620979:web:7f3c1f6004881bbf1217c6",
};

const app = initializeApp(firebaseConfig);

//signing in
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const db = getFirestore();

export const retrieveUsers = async () => {
  console.log(`fetching data -- all users`);

  const colRefAllUsers = collection(db, "users"); //collection reference -- all users
  const users = [];
  try {
    const snapshot = await getDocs(colRefAllUsers); //get collection data -- getDocs returns a promise
    snapshot.docs.forEach((doc) => {
      users.push(doc.id);
    });
  } catch (err) {
    console.log(err);
  }
  console.log(users);
  return users;
};

export const retrievePUB = async (topic) => {
  console.log(`fetching data -- public comments`);

  const colRef = collection(db, "users", "publicComments", topic); //collection reference
  const publicComments = [];
  try {
    const snapshot = await getDocs(colRef); //get collection data -- getDocs returns a promise
    snapshot.docs.forEach((doc) => {
      publicComments.push({ ...doc.data() /*, id: doc.id*/ });
    });
  } catch (err) {
    console.log(err);
  }
  return publicComments;
};

export const retrievePVT = async (topic, username) => {
  console.log(`fetching data -- private comments`);

  const colRef = collection(db, "users", username, topic); //collection reference
  const privateComments = [];
  try {
    const snapshot = await getDocs(colRef); //get collection data -- getDocs returns a promise
    snapshot.docs.forEach((doc) => {
      privateComments.push({ ...doc.data() /*, id: doc.id*/ });
    });
  } catch (err) {
    console.log(err + " cannot fetch private data -- VL");
  }
  return privateComments;
};

export const retrieveComment = async (topic, id) => {
  console.log(`fetching data -- specific comment`);

  const docRef = doc(db, "users", "publicComments", topic, id);
  try {
    return (await getDoc(docRef)).data();
  } catch (err) {
    console.log(err + " no such comment - VL");
  }
};

export const setNewUser = async (user) => {
  try {
    await setDoc(doc(db, "users", user.user.email), {});
  } catch (err) {
    console.log(err);
  }
};

export const saveChoice = async (topic, username) => {
  console.log(`sending data -- selecting topics`);
  try {
    await setDoc(doc(db, "users", username, "choices", topic), {});
  } catch (err) {
    console.log(err);
  }
};

export const updatePUB = async (topic, comment) => {
  console.log(`sending data -- updating public comments`);

  try {
    await setDoc(
      doc(db, "users", "publicComments", topic, comment.id),
      {
        author: comment.author,
        voters: comment.voters,
        id: comment.id,
        comment: comment.comment,
      },
      { merge: true }
    );
  } catch (err) {
    console.log(err);
  }
};

export const updatePVT = async (topic, username, comment) => {
  console.log(`sending data -- updating private comments`);

  try {
    await setDoc(doc(db, "users", username, topic, comment.id), {
      author: comment.author,
      voters: comment.voters,
      id: comment.id,
      comment: comment.comment,
    });
  } catch (err) {
    console.log(comment);
    console.log(err);
  }
};

export const deletePUBCommentDB = async (topic, id) => {
  console.log(`deleting data`);

  const docRef = doc(db, "users", "publicComments", topic, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    console.log(err);
  }
};

export const deletePVTCommentDB = async (topic, username, id) => {
  console.log(`deleting data`);

  const docRef = doc(db, "users", username, topic, id);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    console.log(err);
  }
};

export const updateVoters = async (topic, id, voters) => {
  console.log(`sending data -- updating votes`);

  const docRef = doc(db, "users", "publicComments", topic, id);
  try {
    await setDoc(
      docRef,
      {
        voters: voters,
      },
      { merge: true }
    );
  } catch (err) {
    console.log(err);
  }
};
