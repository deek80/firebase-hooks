import {useMemo, useEffect, useState} from "react";
import {useAuth} from "./auth";

const useDataRef = ref => {
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

  return [value, error, ref];
};

const useDataPath = ({database}, path) => {
  const pathRef = useMemo(() => path && database().ref(path), [database, path]);
  return useDataRef(pathRef);
};

const useData = ({auth, database}, path) => {
  const user = useAuth({auth});
  return useDataPath(
    {database},
    typeof path === "string" ? path : user && path(user)
  );
};

export {useDataRef, useDataPath, useData};
