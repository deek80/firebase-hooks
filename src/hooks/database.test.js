import {jest, beforeEach, describe, it} from "@jest/globals";
import {act, renderHook} from "@testing-library/react-hooks";
import {useData} from "./database";

describe("the useData hook", () => {
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
    const {result} = renderHook(() => useData(ref));
    expect(result.current).toEqual({value: undefined, error: null});
  });

  it("remembers the most recent data value", () => {
    const {result} = renderHook(() => useData(ref));
    act(() => {
      dataEvent.value({val: () => "abcd"});
      dataEvent.value({val: () => "efgh"});
    });
    expect(result.current).toEqual({value: "efgh", error: null});
  });

  it("returns an error if encountered", () => {
    const {result} = renderHook(() => useData(ref));
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
