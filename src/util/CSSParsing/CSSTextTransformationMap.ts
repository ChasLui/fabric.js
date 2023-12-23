import type { Text } from '../../shapes/Text/Text';
import { parseUnit } from '../misc/svgParsing';
import { CSSTransformationMap } from './CSSTransformationMap';
import type { CSSTransformConfig, CSSTransformConfigMap } from './types';
import {
  colorRestorer,
  colorRestorerNoBlack,
  colorTransformer,
  isDefinedValueTransformer,
  isTruthyValueTransformer,
  unitTransformer,
} from './util';

const dblQuoteRegex = /"/g;

export const CSSTextTransformationMap: CSSTransformConfigMap<
  Text,
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'direction'
  | 'textBackgroundColor'
> & {
  textDecoration: CSSTransformConfig<Text, string>;
} & typeof CSSTransformationMap = {
  ...CSSTransformationMap,
  fontFamily: {
    key: 'font-family',
    transformValue: (value) => value.replace(dblQuoteRegex, "'"),
    restoreValue: (value) =>
      value?.replace(dblQuoteRegex, '').split(',').pop()?.trim(),
  },
  fontSize: {
    key: 'font-size',
    transformValue: (value) => unitTransformer(value),
    restoreValue: (value) => parseUnit(value!),
  },
  fontStyle: {
    key: 'font-style',
    transformValue: isDefinedValueTransformer,
  },
  fontWeight: {
    key: 'font-weight',
    transformValue: isDefinedValueTransformer,
    restoreValue: (value) => {
      !value || isNaN(parseFloat(value)) ? value : parseFloat(value);
    },
  },
  direction: {
    transformValue: isDefinedValueTransformer,
  },
  fill: {
    key: 'color',
    transformValue: colorTransformer,
    restoreValue: colorRestorerNoBlack,
  },
  textBackgroundColor: {
    key: 'background-color',
    transformValue: colorTransformer,
    restoreValue: colorRestorer,
  },
  textDecoration: {
    key: 'text-decoration-line',
    hasValue: false,
    transformValue: (_, { options: { overline, underline, linethrough } }) =>
      [
        isTruthyValueTransformer(overline, 'overline'),
        isTruthyValueTransformer(underline, 'underline'),
        isTruthyValueTransformer(linethrough, 'line-through'),
      ]
        .filter((value) => value)
        .join(' '),
    restoreValue: (value) => {
      if (value) {
        return {
          overline: value.includes('overline'),
          underline: value.includes('underline'),
          linethrough: value.includes('line-through'),
        };
      }
      return null;
    },
  },
};
