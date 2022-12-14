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
}: { filename: string, alt?:string, imageDimensions?:ISizeCalculationResult | null, imageSizes?:ImageSizes } & Pick<Styleable, 'className'>) {
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
  return (
    <div style={{ paddingTop: buildImagePadding(imageDimensions) }} className={classNames('relative overflow-hidden', className)}>
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
function buildSizeString(data?: ImageSizes):string | undefined {
  if (data === undefined) return buildSizeString(FULLSCREEN_IMAGE_SIZES);

  return Object.entries(data)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([key, cnt]) => {
      if (key === '0') return `${100 / cnt}vw`;
      return `(max-width: ${key}px) ${Number(key) / cnt}vw`;
    })
    .join(',');
}

export function buildImagePadding(imageDimensions?:ISizeCalculationResult | null) {
  if (imageDimensions === undefined || imageDimensions === null || imageDimensions.height === undefined || imageDimensions.width === undefined) return '80vh';
  return `min(80vh,${100 * (imageDimensions.height / imageDimensions.width)}%)`;
}
