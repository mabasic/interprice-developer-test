export const SPREAD = "Spread";
export const YIELD = "Yield";
export const THREE_ML_SPREAD = "3MLSpread";

export default [SPREAD, YIELD, THREE_ML_SPREAD];

export function formatSpread(value) {
  const prefix = value > 0 ? "+" : "";

  return `${prefix}${parseInt(value)}bp`;
}

export function formatYield(value) {
  return `${parseFloat(value).toFixed(3)}%`;
}

export function format(display, value) {
  switch (display) {
    case SPREAD:
    case THREE_ML_SPREAD:
      return formatSpread(value);
    case YIELD:
      return formatYield(value);
    default:
      return value;
  }
}
