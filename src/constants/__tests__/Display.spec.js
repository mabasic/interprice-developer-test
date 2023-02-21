import { describe, it, expect } from "vitest";
import {
  formatSpread,
  formatYield,
  format as formatDisplay,
  SPREAD,
  YIELD,
  THREE_ML_SPREAD,
} from "../Display";

describe("formatSpread", () => {
  it("returns positive value formatted", () => {
    expect(formatSpread(100)).toEqual("+100bp");
  });

  it("returns negative value formatted", () => {
    expect(formatSpread(-100)).toEqual("-100bp");
  });
});

describe("formatYield", () => {
  it("returns value formatted", () => {
    expect(formatYield(100)).toEqual("100.000%");
    expect(formatYield(-100)).toEqual("-100.000%");
    expect(formatYield(99.45235444)).toEqual("99.452%");
    expect(formatYield(99.45)).toEqual("99.450%");
  });
});

describe("formatDisplay", () => {
  it("returns value formatted depending on the display", () => {
    expect(formatDisplay(SPREAD, 100)).toEqual("+100bp");
    expect(formatDisplay(THREE_ML_SPREAD, 100)).toEqual("+100bp");
    expect(formatDisplay(YIELD, 100)).toEqual("100.000%");
  });

  it("returns value without formatting when display is not supported", () => {
    expect(formatDisplay("Something", 100)).toEqual(100);
  });
});
