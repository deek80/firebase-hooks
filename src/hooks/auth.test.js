import {beforeEach, describe, expect, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useAuth} from "./auth";
import {mockFirebase} from "./mocks";

describe("useAuth", () => {
  let firebase;

  beforeEach(() => {
    firebase = mockFirebase();
  });

  it("initially starts with a null user", () => {
    const {result} = renderHook(() => useAuth(firebase));
    expect(result.current).toBe(null);
  });

  it("remembers the most recent logged-in user", () => {
    const expectedUser = {uid: "abc"};
    const {result} = renderHook(() => useAuth(firebase));
    act(() => {
      firebase.callbacks.loginAs({uid: "some user"});
      firebase.callbacks.loginAs(expectedUser);
    });
    expect(result.current).toBe(expectedUser);
  });

  it("logs you out on error", () => {
    const {result} = renderHook(() => useAuth(firebase));
    act(() => {
      firebase.callbacks.loginAs({uid: "some user"});
      firebase.callbacks.loginError();
    });
    expect(result.current).toBe(null);
  });
});
