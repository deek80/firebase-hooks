# Overview

This package defines some react hooks for easy interaction with various
firebase services. The hooks connect to firebase's listeners so that they
are updated immediately when any changes are made (i.e. the user logs out,
a new user logs in, or a value in the database is updated).

# Usage

- `useAuth`: A hook to get the currently logged-in user

  ```jsx
  firebase.initializeApp(...);

  const MyUserComponent = props => {
    const user = useAuth(firebase);
    if (user === null) {
      return <Loading />;
    }
    return <div>Logged in as {user.email}!</div>;
  };
  ```

- `useDataPath`: A hook to use firebase realtime data for a given path

  ```jsx
  firebase.initializeApp(...);

  const MyDataComponent = props => {
    const {value, error} = useDataPath("public/data/path");
    if (error) {
      return <div>Error fetching data: {error}</div>;
    }
    if (value === undefined) {
      return <Loading />;
    }
    return <div>Current value in database: {value}</div>;
  };
  ```

# Recipes

- Create a local firebase folder and inject the initialized app there. I
  really wish I could have included this in the package, but it's tough to
  deal with firebase's requirement of having an initalized app in order to
  access auth() or database() from within.

  ```jsx
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/database";
  import {useAuth, useDataPath} from "@deek80/firebase-hooks";

  firebase.initalizeApp({
    ...firebaseConfig,
  });

  const useFirebaseAuth = useAuth.apply(null, firebase);
  const useFirebaseData = useDataPath.apply(null, firebase);

  export {useFirebaseAuth, useFirebaseData};
  ```

- Create a private data hook:

  ```jsx
  const usePrivateData = path => {
    const user = useFirebaseAuth();
    const privatePath = useMemo(
      () => `users/${user.uid}/data/${path}`,
      [user, path]
    );
    return useFirebaseData(privatePath);
  };
  ```

  and corresponding database rule:

  ```json
  {
    "rules": {
      "users": {
        "$uid": {
          "data": {
            ".read": "auth != null && auth.uid == $uid",
            ".write": "auth != null && auth.uid == $uid"
          }
        }
      }
    }
  }
  ```

# Installation

```bash
npm install @deek80/firebase-hooks
```
