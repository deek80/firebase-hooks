import {jest, expect} from "@jest/globals";

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

  return {
    auth,
    database,
    get callbacks() {
      const authCalls = auth.mock.results;
      expect(authCalls).toHaveLength(1);

      const authCallbacks = authCalls[0].value.onAuthStateChanged.mock.calls;
      expect(authCallbacks).toHaveLength(1);

      const [loginAs, loginError] = authCallbacks[0];
      return {loginAs, loginError};
    },
  };
};

export {mockFirebase};
