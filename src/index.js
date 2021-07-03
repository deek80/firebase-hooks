import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {useAuth, useAuth} from "./hooks/auth";
import {useData} from "./hooks/database";

// maybe something like this would be ok:
const useFirebaseAuth = useAuth.apply(this, firebase.auth());
const useFirebaseData = useData.apply(this, firebase.database());
// then you could inject your own thing and test it...

export {useFirebaseAuth};
export {
  signInWithGoogle,
  signInWithGoogleReselect,
  signOut,
} from "./util/signin";
