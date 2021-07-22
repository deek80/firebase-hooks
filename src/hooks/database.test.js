import {beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useDataRef, useData} from "./database";
import {mockFirebase} from "./mocks";

describe("useDataRef", () => {
  let firebase, ref;

  beforeEach(() => {
    firebase = mockFirebase();
    ref = firebase.database().ref();
  });

  it("hangs onto the latest update or error", () => {
    const {result} = renderHook(() => useDataRef(ref));
    expect(result.current).toEqual([undefined, null, ref]);

    act(() => firebase.callbacks.dbValue("abcd"));
    expect(result.current).toEqual(["abcd", null, ref]);

    act(() => firebase.callbacks.dbValue("efgh"));
    expect(result.current).toEqual(["efgh", null, ref]);

    act(() => firebase.callbacks.dbError("uh oh!"));
    expect(result.current).toEqual([undefined, "uh oh!", ref]);

    act(() => firebase.callbacks.dbValue("recovered"));
    expect(result.current).toEqual(["recovered", null, ref]);
  });
});

describe("useData", () => {
  let firebase;

  beforeEach(() => {
    firebase = mockFirebase();
  });

  it("can build the useDataRef hook with a path string", () => {
    renderHook(() => useData(firebase, "a/path"));
    expect(firebase.inspections.ref).toHaveBeenCalledWith("a/path");
  });

  it("can build the useDataRef hook with a path function", () => {
    renderHook(() => useData(firebase, u => `users/${u.id}/data`));
    expect(firebase.database).not.toHaveBeenCalled();

    act(() => firebase.callbacks.loginAs({id: "123"}));
    expect(firebase.inspections.ref).toHaveBeenCalledWith("users/123/data");
  });

  it("updates the data path when the user changes", () => {
    renderHook(() => useData(firebase, u => `users/${u.id}/data`));
    act(() => firebase.callbacks.loginAs({id: "123"}));
    expect(firebase.inspections.ref).toHaveBeenCalledWith("users/123/data");
    expect(firebase.database).toHaveBeenCalledTimes(1);

    act(() => firebase.callbacks.loginAs({id: "456"}));
    expect(firebase.inspections.ref).toHaveBeenCalledWith("users/456/data");
    expect(firebase.database).toHaveBeenCalledTimes(2);
  });

  it("removes the ref when the user logs out", () => {
    const {result} = renderHook(() =>
      useData(firebase, u => `users/${u.id}/data`)
    );
    act(() => firebase.callbacks.loginAs({id: "123"}));
    expect(result.current[2]).not.toBeNull();

    act(() => firebase.callbacks.loginAs(null));
    expect(result.current[2]).toBeNull();
  });

  it("does not update a string data ref when the user changes", () => {
    renderHook(() => useData(firebase, "a/path"));
    expect(firebase.database).toHaveBeenCalledTimes(1);
    act(() => firebase.callbacks.loginAs({id: "123"}));
    expect(firebase.database).toHaveBeenCalledTimes(1);
  });
});
