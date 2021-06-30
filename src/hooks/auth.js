import {useEffect, useState} from "react";
import {auth} from "../init";

/*
  Defines a hook to fetch and listen for changes to the currently logged in
  firebase user:

  ```jsx
  const MyComponent = () => {
    const user = useAuth();
    const name = user ? user.displayName : "nobody";

    return (
      <div>
        Current user: {name}
      </div>
    )
  }
  ```

  Possible return values
    user: null    meaning: no one logged in, or no response from firebase yet
    user: User    meaning: someone logged in!
 */

const useAuth = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      user => setUser(user),
      _err => setUser(null)
    );
    return unsubscribe;
  }, []);

  return user;
};

export {useAuth};
