import {useMemo, useEffect, useState} from "react";
import {useAuth} from "./auth";

/*
  Defines a hook to fetch and listen for changes to data in a firebase path,
  which is automatically prefixed with a unique string for the currently logged in user.

  ```jsx
  const MyComponent = () => {
    const [value, ref] = useData("some/database/path");

    if (value === undefined) {
      return <CircularProgress />;
    }

    return (
      <Button onClick={() => ref.transaction(v => v + 1)}>
        Current value: {value}
      </Button>
    )
  }
  ```

  Possible return values (gotta rethink/confirm this...)
    error: non-null     meaning: error response from firebase
    value: undefined    meaning: no response from firebase yet
    value: null         meaning: no value saved in firebase
    value: other        meaning: got the latest from firebase

 */

// const useFirebaseRef = path => {
//   const user = useAuth();
//   return useMemo(
//     () => user && firebase.database().ref(`users/${user.uid}/data/${path}`),
//     [user, path]
//   );
// };

const useData = ref => {
  const [{value, error}, setState] = useState({value: undefined, error: null});

  useEffect(() => {
    if (ref === null) {
      setState({value: undefined, error: null}); // i.e. user has logged out
      return;
    }

    ref.on(
      "value",
      data => setState({value: data.val(), error: null}),
      error => setState({value: undefined, error})
    );

    return () => {
      ref.off("value");
    };
  }, [ref]);

  return {value, error};
};

export {useData};
