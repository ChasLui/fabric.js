import { reNum } from '../../parser/constants';

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 * p is a number that is preceded by an arbitary number of spaces, maybe 0,
 * a comma or not, and then possibly more spaces or not.
 */
const p = `\\s*,?\\s*(${reNum})`;

const reMoveToCommand = `(M) ?(?:${p}${p} ?)+`;

const reLineCommand = `(L) ?(?:${p}${p} ?)+`;

const reHorizontalLineCommand = `(H) ?(?:${p} ?)+`;

const reVerticalLineCommand = `(V) ?(?:${p} ?)+`;

const reClosePathCommand = String.raw`(Z)\s*`;

const reCubicCurveCommand = `(C) ?(?:${p}${p}${p}${p}${p}${p} ?)+`;

const reCubicCurveShortcutCommand = `(S) ?(?:${p}${p}${p}${p} ?)+`;

const reQuadraticCurveCommand = `(Q) ?(?:${p}${p}${p}${p} ?)+`;

const reQuadraticCurveShortcutCommand = `(T) ?(?:${p}${p} ?)+`;

export const reArcCommandPoints = `${p}${p}${p}[ ,]?([01])[ ,]?([01])${p}${p}`;
const reArcCommand = `(A) ?(?:${reArcCommandPoints} ?)+`;

export const rePathCommand =
  `(?:(?:${reMoveToCommand})` +
  `|(?:${reLineCommand})` +
  `|(?:${reHorizontalLineCommand})` +
  `|(?:${reVerticalLineCommand})` +
  `|(?:${reClosePathCommand})` +
  `|(?:${reCubicCurveCommand})` +
  `|(?:${reCubicCurveShortcutCommand})` +
  `|(?:${reQuadraticCurveCommand})` +
  `|(?:${reQuadraticCurveShortcutCommand})` +
  `|(?:${reArcCommand}))`;
