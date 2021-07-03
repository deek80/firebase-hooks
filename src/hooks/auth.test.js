import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useAuth} from "./auth";

describe("the useAuth hook", () => {
  const callback = {};

  const onChange = (success, failure) => {
    // capture the callbacks registered in the auth hook
    callback.success = success;
    callback.failure = failure;
    return jest.fn();
  };

  beforeEach(() => {
    callback.success = null;
    callback.failure = null;
  });

  it("initially starts with a null user", () => {
    const {result} = renderHook(() => useAuth(onChange));
    expect(result.current).toBe(null);
  });

  it("remembers the most recent logged-in user", () => {
    const expectedUser = {uid: "abc"};
    const {result} = renderHook(() => useAuth(onChange));
    act(() => {
      callback.success(expectedUser);
    });
    expect(result.current).toBe(expectedUser);
  });
});
