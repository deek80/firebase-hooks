import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useData} from "./database";

describe("the useData hook", () => {
  // mock firebase database ref and capture the registered callbacks
  const dataEvent = {};
  const ref = () => ({
    on: (_label, onValue, onError) => {
      dataEvent.value = onValue;
      dataEvent.error = onError;
      return jest.fn();
    },
  });

  beforeEach(() => {
    dataEvent.value = null;
    dataEvent.error = null;
  });
  // LEFT OFF HERE: keep fixing up the auth test so that it applies to the database!

  it("initially starts with a null user", () => {
    const {result} = renderHook(() => useAuth(auth));
    expect(result.current).toBe(null);
  });

  it("remembers the most recent logged-in user", () => {
    const expectedUser = {uid: "abc"};
    const {result} = renderHook(() => useAuth(auth));
    act(() => {
      dataEvent.login(expectedUser);
    });
    expect(result.current).toBe(expectedUser);
  });
});
