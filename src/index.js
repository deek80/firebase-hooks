import "firebase/auth";
import "firebase/database";
import firebase from "firebase/app";
import {useAuth} from "./hooks/auth";
import {useDataByPath} from "./hooks/database";

// inject firebase
const {auth, database} = firebase;
const useFirebaseAuth = useAuth.apply(null, auth());
const useFirebaseData = useDataByPath.apply(null, database());

export {useFirebaseAuth, useFirebaseData};
export {signIn, signOut} from "./util/auth";
