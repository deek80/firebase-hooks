import "firebase/auth";
import "firebase/database";
import firebase from "firebase/app";
import {useAuth} from "./hooks/auth";
import {useData} from "./hooks/database";

// inject firebase
const {auth, database} = firebase;
const useFirebaseAuth = useAuth.apply(null, auth());
const useFirebaseUserData = useData.apply(null, auth(), database());

export {useFirebaseAuth, useFirebaseUserData};
export {signIn, signOut} from "./util/auth";
