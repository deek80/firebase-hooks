import "firebase/auth";
import firebase from "firebase/app";
const {auth} = firebase;

const signIn = {
  google: () => {
    auth().signInWithPopup(new auth.GoogleAuthProvider());
  },

  googleSwitchUser: () => {
    auth().signInWithPopup(
      new auth.GoogleAuthProvider().setCustomParameters({
        prompt: "select_account",
      })
    );
  },
};

const signOut = () => {
  auth().signOut();
};

export {signIn, signOut};
