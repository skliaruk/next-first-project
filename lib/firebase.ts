// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { getStorage, TaskEvent } from "firebase/storage";
import { Post } from "./types";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy0tpA8Mj3E5Lny0c-jUJrLQ0_INC5A20",
  authDomain: "next-first-project-7c914.firebaseapp.com",
  projectId: "next-first-project-7c914",
  storageBucket: "next-first-project-7c914.appspot.com",
  messagingSenderId: "1067439826985",
  appId: "1:1067439826985:web:a6f72dbdf126477a9b5438",
  measurementId: "G-3YZE29D8RG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const fromMillis = Timestamp.fromMillis;
export const serverTS = serverTimestamp;
export const inc = increment;

/// Helper functions
export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, "users");

  const q = query(usersRef, where("username", "==", username), limit(1));

  const userDoc = (await getDocs(q)).docs[0];

  return userDoc;
}

export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
