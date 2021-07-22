import {jest} from "@jest/globals";

const mockFirebase = () => {
  const auth = jest.fn(() => ({
    onAuthStateChanged: jest.fn(() => jest.fn()),
  }));

  const database = jest.fn(() => ({
    ref: jest.fn(() => ({
      on: jest.fn(),
      off: jest.fn(),
    })),
  }));

  const _last = items => items[items.length - 1];

  const _authStateCallback = i => {
    const authInstance = _last(auth.mock.results).value;
    return _last(authInstance.onAuthStateChanged.mock.calls)[i];
  };

  const _refFunction = () => {
    const db = _last(database.mock.results).value;
    return db.ref;
  };

  const _refOnCallback = i => {
    const ref = _last(_refFunction().mock.results).value;
    return _last(ref.on.mock.calls)[i];
  };

  return {
    auth,
    database,
    callbacks: {
      get loginAs() {
        return _authStateCallback(0);
      },

      get loginError() {
        return _authStateCallback(1);
      },

      get dbValue() {
        const valueCallback = _refOnCallback(1);
        return value => valueCallback({val: () => value});
      },

      get dbError() {
        return _refOnCallback(2);
      },
    },

    inspections: {
      get ref() {
        return _refFunction();
      },
    },
  };
};

export {mockFirebase};
