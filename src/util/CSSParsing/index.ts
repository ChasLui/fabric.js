import type { FabricObject } from '../../shapes/Object/Object';
import type { TextStyleDeclaration } from '../../shapes/Text/StyledText';
import type { Text } from '../../shapes/Text/Text';
import type { textDecorationProperties } from '../../shapes/Text/constants';
import { CSSTextTransformationMap } from './CSSTextTransformationMap';
import { CSSTransformationMap } from './CSSTransformationMap';
import type { CSSTransformContext } from './types';

export function stylesToCSS<
  T extends Partial<Pick<FabricObject, keyof typeof CSSTransformationMap>>
>(target: FabricObject, options: T, map = CSSTransformationMap) {
  let cssText = '';
  const context: CSSTransformContext<T> = {
    target,
    options,
  };
  for (const key in map) {
    const {
      key: k = key,
      transformValue,
      hasValue = true,
    } = map[key as keyof typeof map];
    const v = options[key as keyof typeof map];
    const value =
      transformValue && (key in options || !hasValue)
        ? transformValue(v, context)
        : v;
    if (value || value === 0) {
      (Array.isArray(value) ? value : [value]).forEach((value) => {
        cssText += `${k}:${value};`;
      });
    }
  }
  return { cssText };
}

export function textStylesToCSS(
  target: Text,
  options: Partial<
    Pick<Text, Exclude<keyof typeof CSSTextTransformationMap, 'textDecoration'>>
  > = target
) {
  return stylesToCSS(target, options, CSSTextTransformationMap);
}

export function stylesFromCSS(
  styles: CSSStyleDeclaration,
  map = CSSTransformationMap
) {
  const options: Partial<
    TextStyleDeclaration & {
      textDecoration: Pick<
        TextStyleDeclaration,
        typeof textDecorationProperties
      >;
    }
  > = {};
  for (const key in map) {
    const { key: k = key, restoreValue } = map[key as keyof typeof map];
    const v = styles[k as keyof CSSStyleDeclaration];
    const value = restoreValue ? restoreValue(v, { options }) : v;
    (value || value === 0) && (options[key] = value);
  }
  return options;
}

export function textStylesFromCSS(styles: CSSStyleDeclaration) {
  const { textDecoration, ...rest } = stylesFromCSS(
    styles,
    CSSTextTransformationMap
  );
  return { ...textDecoration, ...rest };
}
