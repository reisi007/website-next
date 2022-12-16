import ExportedImage from 'next-image-export-optimizer';
import classNames from 'classnames';
import { useMemo } from 'react';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import { useLink } from './useLink';
import { Styleable } from '../types/Styleable';

export function Image({
  alt,
  className,
  imageDimensions,
  filename,
  imageSizes,
}: {
  filename: string,
  alt?: string,
  imageDimensions?: ISizeCalculationResult | Array<ISizeCalculationResult> | null,
  imageSizes?: ImageSizes
} & Pick<Styleable, 'className'>) {
  const src = useLink(`images/${filename}.jpg`);
  const nextImage = useMemo(() => (
    <ExportedImage
      className="h-full w-full object-contain"
      fill
      src={src}
      alt={alt ?? `${filename}.jpg`}
      sizes={buildSizeString(imageSizes)}
    />
  ), [alt, filename, imageSizes, src]);
  const paddingTop = useImagePadding(imageDimensions);
  return (
    <div style={{ paddingTop }} className={classNames('relative overflow-hidden', className)}>
      {nextImage}
    </div>
  );
}

export type ImageSizes = Record<Breakpoint, number>;

export enum Breakpoint {
  '2xl' = 1320,
  xl = 1140,
  lg = 960,
  md = 720,
  sm = 540,
  default = 0,
}

const FULLSCREEN_IMAGE_SIZES: ImageSizes = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 2,
  [Breakpoint.xl]: 3,
  [Breakpoint['2xl']]: 4,
};

function buildSizeString(data?: ImageSizes): string | undefined {
  if (data === undefined) return buildSizeString(FULLSCREEN_IMAGE_SIZES);

  return Object.entries(data)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([key, cnt]) => {
      if (key === '0') return `${100 / cnt}vw`;
      return `(max-width: ${key}px) ${Number(key) / cnt}vw`;
    })
    .join(',');
}

const DEFAULT_IMAGE_HEIGHT = '80vh';
export function useImagePadding(imageDimensions?: ISizeCalculationResult | Array<ISizeCalculationResult> | null) {
  return useMemo(() => {
    if (imageDimensions === undefined || imageDimensions === null) {
      return DEFAULT_IMAGE_HEIGHT;
    }
    const definitlyArray: Array<ISizeCalculationResult> = Array.isArray(imageDimensions) ? imageDimensions : [imageDimensions];
    const id: ISizeCalculationResult = definitlyArray.reduce((previousValue, currentValue) => {
      const pw = previousValue.width;
      const ph = previousValue.height;
      const cw = currentValue.width;
      const ch = currentValue.height;

      const isPrevUndefined = pw === undefined || ph === undefined;
      const isCurUndefined = cw === undefined || ch === undefined;
      if (isCurUndefined && isPrevUndefined) return previousValue;
      if (isCurUndefined || isPrevUndefined) {
        if (isPrevUndefined) return currentValue;
        return previousValue;
      }
      const pPrev = ph / pw;
      const pCur = ch / cw;
      if (pPrev < pCur) return previousValue;
      return currentValue;
    });

    if (id.height === undefined || id.width === undefined) return DEFAULT_IMAGE_HEIGHT;
    return `min(${DEFAULT_IMAGE_HEIGHT},${100 * (id.height / id.width)}%)`;
  }, [imageDimensions]);
}
