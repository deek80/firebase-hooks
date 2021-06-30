import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  appId: process.env.REACT_APP_appId,
  authDomain: process.env.REACT_APP_authDomain,
  measurementId: process.env.REACT_APP_measurementId,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
});

export const {auth, database} = firebase;
