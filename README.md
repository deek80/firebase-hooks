# Overview

This package defines some react hooks for easy interaction with various
firebase services. The hooks connect to firebase's listeners so that they
are updated immediately when any changes are made (i.e. the user logs out,
a new user logs in, or a value in the database is updated).

# Installation

```bash
npm install @deek80/firebase-hooks
```

# Getting started

You'll first need to import firebase, initialize it, and call `makeFirebaseHooks`.
This sets up the `useAuth` and `useData` hooks for the rest of your app to
use.

```jsx
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import {makeFirebaseHooks} from "@deek80/firebase-hooks";

firebase.initalizeApp({
  ...firebaseConfig,
});

const {useAuth, useData} = makeFirebaseHooks(firebase);

export {useAuth, useData};
```

# Examples:

- `useAuth`: A hook to get the currently logged-in user

  ```jsx
  const MyUserComponent = props => {
    const user = useAuth();
    if (user === null) {
      return <Loading />;
    }
    return <div>Logged in as {user.email}!</div>;
  };
  ```

- `useData`: A hook to use firebase realtime data for a given path
  or path function.

  ```jsx
  const MyDataComponent = props => {
    const [name, error, ref] = useData(u => `users/${u.uid}/nickname`);
    const updateName = () => {
      ref.transaction(
        currentName => currentName + "!",
        err => alert("failed to update name :(")
      );
    };

    if (error) {
      return <div>Error fetching data: {error}</div>;
    }
    if (name === undefined) {
      return <Loading />;
    }
    return (
      <div>
        <div>Hello, {name}</div>
        <Button onClick={updateName}>Click me</Button>
      </div>
    );
  };
  ```

  With this example, you'd have a corresponding database rule:

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
