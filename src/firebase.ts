import firebase from "firebase/app";
import "firebase/database";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCBE0nuHp762CDd1XSj4W3rGPiDc4ynbT8",
  authDomain: "pyrotechnics-2814c.firebaseapp.com",
  databaseURL: "https://pyrotechnics-2814c.firebaseio.com",
  projectId: "pyrotechnics-2814c",
  storageBucket: "pyrotechnics-2814c.appspot.com",
  messagingSenderId: "745526117546",
  appId: "1:745526117546:web:ce47211610b826f5a5fcd3",
  measurementId: "G-KKE9QTQQQD",
});

export const db = app.database();
export const dataTodos = db.ref("todosList");

// export const db = firebase.initializeApp({ databaseURL: 'MY PROJECT URL' }).database()
