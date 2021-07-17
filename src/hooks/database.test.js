import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useDataRef, useDataPath, useData} from "./database";

describe("useDataRef", () => {
  // mock firebase database ref and capture the registered callbacks
  const dataEvent = {};
  const ref = {
    on: (_label, onValue, onError) => {
      dataEvent.value = onValue;
      dataEvent.error = onError;
      return jest.fn();
    },
    off: jest.fn(),
  };

  beforeEach(() => {
    dataEvent.value = null;
    dataEvent.error = null;
  });

  it("initially starts with undefined data", () => {
    const {result} = renderHook(() => useDataRef(ref));
    expect(result.current).toEqual([undefined, null, ref]);
  });

  it("remembers the most recent data value", () => {
    const {result} = renderHook(() => useDataRef(ref));
    act(() => {
      dataEvent.value({val: () => "abcd"});
      dataEvent.value({val: () => "efgh"});
    });
    expect(result.current).toEqual(["efgh", null, ref]);
  });

  it("returns an error if encountered", () => {
    const {result} = renderHook(() => useDataRef(ref));
    act(() => {
      dataEvent.value({val: () => "abcd"});
      dataEvent.error({something: "broke"});
    });
    expect(result.current).toEqual([undefined, {something: "broke"}, ref]);
  });
});

describe("useDataPath", () => {
  const firebase = {
    auth: () => ({
      onAuthStateChanged: () => jest.fn(),
    }),
    database: () => ({
      ref: () => ({
        on: jest.fn(),
        off: jest.fn(),
      }),
    }),
  };
  it("renders", () => {
    const {result} = renderHook(() => useDataPath(firebase, "a/path"));
    const [value, error, _ref] = result.current;
    expect([value, error]).toEqual([undefined, null]);
  });
  it("is the same as useData if the path is a string", () => {
    const {result} = renderHook(() => useData(firebase, "a/path"));
    const [value, error, _ref] = result.current;
    expect([value, error]).toEqual([undefined, null]);
  });
});
