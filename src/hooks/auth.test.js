import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useAuth} from "./auth";

describe("useAuth", () => {
  // mock firebase auth and capture the registered callbacks
  const authEvent = {};
  const firebase = {
    auth: () => ({
      onAuthStateChanged: (onLogin, onError) => {
        authEvent.login = onLogin;
        authEvent.error = onError;
        return jest.fn();
      },
    }),
  };

  beforeEach(() => {
    authEvent.login = null;
    authEvent.error = null;
  });

  it("initially starts with a null user", () => {
    const {result} = renderHook(() => useAuth(firebase));
    expect(result.current).toBe(null);
  });

  it("remembers the most recent logged-in user", () => {
    const expectedUser = {uid: "abc"};
    const {result} = renderHook(() => useAuth(firebase));
    act(() => {
      authEvent.login({uid: "some user"});
      authEvent.login(expectedUser);
    });
    expect(result.current).toBe(expectedUser);
  });

  it("logs you out on error", () => {
    const {result} = renderHook(() => useAuth(firebase));
    act(() => {
      authEvent.login({uid: "some user"});
      authEvent.error();
    });
    expect(result.current).toBe(null);
  });
});
