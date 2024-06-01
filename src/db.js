"use strict";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCLZNa7mHlhQGTopV36YVOqlbkWwgB3Uxk",
  authDomain: "to-do-list-ca514.firebaseapp.com",
  projectId: "to-do-list-ca514",
  storageBucket: "to-do-list-ca514.appspot.com",
  messagingSenderId: "808929348011",
  appId: "1:808929348011:web:a1bafd4e522d6ebc33aaee",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTasks(db) {
  try {
    const tasksCol = collection(db, "tasks");
    const taskSnapshot = await getDocs(tasksCol);
    const taskList = taskSnapshot.docs.map((task) => {
      return task.data();
    });

    return taskList;
  } catch (err) {
    console.error("Error with getting data for db:", err.message);
  }
}

export { db, getTasks };
