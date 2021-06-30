import {auth} from "./init";

const signInWithGoogleReselect = () => {
  auth().signInWithPopup(
    new auth.GoogleAuthProvider().setCustomParameters({
      prompt: "select_account",
    })
  );
};

const signInWithGoogle = () => {
  auth().signInWithPopup(new auth.GoogleAuthProvider());
};

const signOut = () => {
  auth().signOut();
};

export {signInWithGoogle, signInWithGoogleReselect, signOut};
