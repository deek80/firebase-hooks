import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useDataRef, useDataPath} from "./database";

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
    expect(result.current).toEqual({value: undefined, error: null});
  });

  it("remembers the most recent data value", () => {
    const {result} = renderHook(() => useDataRef(ref));
    act(() => {
      dataEvent.value({val: () => "abcd"});
      dataEvent.value({val: () => "efgh"});
    });
    expect(result.current).toEqual({value: "efgh", error: null});
  });

  it("returns an error if encountered", () => {
    const {result} = renderHook(() => useDataRef(ref));
    act(() => {
      dataEvent.value({val: () => "abcd"});
      dataEvent.error({something: "broke"});
    });
    expect(result.current).toEqual({
      value: undefined,
      error: {something: "broke"},
    });
  });
});

describe("useDataPath", () => {
  const firebase = {
    database: () => ({
      ref: () => ({
        on: jest.fn(),
        off: jest.fn(),
      }),
    }),
  };
  it("renders", () => {
    const {result} = renderHook(() => useDataPath(firebase, "a/path"));
    expect(result.current).toEqual({value: undefined, error: null});
  });
});
