import {useMemo, useEffect, useState} from "react";

const useDataByRef = ref => {
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

const useDataByPath = (database, path) => {
  const pathRef = useMemo(() => path && database().ref(path), [database, path]);
  return useDataByRef(pathRef);
};

export {useDataByRef, useDataByPath};
