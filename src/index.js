import {useAuth} from "./hooks/auth";
import {useData} from "./hooks/database";

const makeFirebaseHooks = firebase => ({
  useAuth: useAuth.apply(null, [firebase]),
  useData: useData.apply(null, [firebase]),
});

export {makeFirebaseHooks};
