import {useAuth} from "./hooks/auth";
import {useData} from "./hooks/database";

const makeFirebaseHooks = firebase => ({
  useAuth: () => useAuth(firebase),
  useData: path => useData(firebase, path),
});

export {makeFirebaseHooks};
