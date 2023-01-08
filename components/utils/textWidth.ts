import { useMemo } from 'react';

let canvas: HTMLCanvasElement | undefined;
const ALL_FONT_SIZES = Array.from({ length: 100 }, (_, i) => 6 + i);

export function useFontSize(text: string, {
  maxHeight,
  maxWidth,
}: { maxWidth?: number, maxHeight?: number }) {
  return useMemo(() => {
    const idx = binarySearch(ALL_FONT_SIZES, (i) => {
      const textMetrics = getTextMetrics(text, getFontSizeOf({ size: `${i}px` }));
      const height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
      return (!maxWidth || textMetrics.width > maxWidth) && (!maxHeight || height > maxHeight);
    });
    return ALL_FONT_SIZES[idx > 0 ? idx - 1 : 0];
  }, [maxHeight, maxWidth, text]);
}

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextMetrics(text: string, font: string): TextMetrics {
  // re-use canvas object for better performance
  if (canvas === undefined) {
    canvas = document.createElement('canvas');
  }
  const context = canvas.getContext('2d');
  if (context === null) {
    throw Error('No 2D context found');
  }
  context.font = font;
  return context.measureText(text);
}

function getCssStyle(element: HTMLElement, prop: string) {
  return window.getComputedStyle(element, null)
    .getPropertyValue(prop);
}

function getFontSizeOf(overrides?: { el?: HTMLElement, weight?: string, size?: string, family?: string }) {
  const el = overrides?.el ?? document.body;
  const fontWeight = overrides?.weight || getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = overrides?.size || getCssStyle(el, 'font-size') || '16px';
  const fontFamily = overrides?.family || getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

/**
 * Return 0 <= i <= array.length such that !pred(array[i - 1]) && pred(array[i]).
 * https://stackoverflow.com/a/41956372
 */
function binarySearch<T>(array: Array<T>, pred: (elem: T) => boolean): number {
  let lo = -1;
  let hi = array.length;
  while (1 + lo < hi) {
    // eslint-disable-next-line no-bitwise
    const mi = lo + ((hi - lo) >> 1);
    if (pred(array[mi])) {
      hi = mi;
    } else {
      lo = mi;
    }
  }
  return hi;
}
