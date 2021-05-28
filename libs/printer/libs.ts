const log = console.log; // Cache the console.log function, so log as a shortcut

// To indicate we will use color system
const colorsPrefix = "\u001b[";
const colorsSuffix = "\u001b[0m";

/**
 * @param {string} msg
 * @param {number} color
 * @param {string} symbol {dot: '.', ok: '✓' etc...}
 * @param {boolean} symbolPrev If true the symbol will be a prefix for @param msg otherwise it will be a suffix
 */
export const print = (msg: string, color: number  = 90, symbol: string = "dot", symbolPrev = true) => {
  let fullMsg = "";
  if (symbolPrev) { // Symbol as prefix
    fullMsg = symbol + " " + msg;
  } else { // Symbol as suffix
    fullMsg = msg + " " + symbol;
  }
  log(colorsPrefix + color + "m" + fullMsg + colorsSuffix);
};
export { default as Colors } from "./colors";
export { default as Symbols } from "./symbols";
