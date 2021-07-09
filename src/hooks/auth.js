import {useEffect, useState} from "react";

const useAuth = ({auth}) => {
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
