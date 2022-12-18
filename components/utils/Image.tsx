import ExportedImage from 'next-image-export-optimizer';
import { useMemo } from 'react';
import classNames from 'classnames';
import { ImageSize } from 'ts-exif-parser';
import { useLink } from './useLink';
import { Styleable } from '../types/Styleable';

export function Image({
  alt,
  size,
  className,
  filename,
  ext = '.jpg',
  breakpoints,
}: {
  filename: string,
  ext?: string
  alt?: string,
  size?: ImageSize,
  breakpoints?: ImageBreakpoints
} & Pick<Styleable, 'className'>) {
  const src = useLink(`images/${filename}${ext}`);
  const nextImage = useMemo(() => (
    <ExportedImage
      className="h-full w-full object-contain"
      fill
      src={src}
      alt={alt ?? `${filename}.jpg`}
      sizes={buildSizeString(breakpoints)}
    />
  ), [alt, filename, breakpoints, src]);

  const paddingTop = useImagePadding(size);
  return (
    <div style={{ paddingTop }} className={classNames('relative overflow-hidden', className)}>
      {nextImage}
    </div>
  );
}

export type ImageBreakpoints = Record<Breakpoint, number>;

export enum Breakpoint {
  '2xl' = 1320,
  xl = 1140,
  lg = 960,
  md = 720,
  sm = 540,
  default = 0,
}

const DEFAULT_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 1,
  [Breakpoint.xl]: 1,
  [Breakpoint['2xl']]: 1,
};

function buildSizeString(data?: ImageBreakpoints): string | undefined {
  if (data === undefined) return buildSizeString(DEFAULT_BREAKPOINTS);

  return Object.entries(data)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([key, cnt]) => {
      if (key === '0') return `${100 / cnt}vw`;
      return `(max-width: ${key}px) ${Number(key) / cnt}vw`;
    })
    .join(',');
}

const DEFAULT_IMAGE_HEIGHT = '80vh';

export function useImagePadding(imageDimensions?: ImageSize, moreConstraints?: string) {
  return useMemo(() => {
    if (imageDimensions === undefined || imageDimensions === null) {
      return DEFAULT_IMAGE_HEIGHT;
    }

    const {
      width,
      height,
    } = imageDimensions;
    if (moreConstraints !== undefined) return `min(${DEFAULT_IMAGE_HEIGHT},${100 * (height / width)}%,${moreConstraints})`;
    return `min(${DEFAULT_IMAGE_HEIGHT},${100 * (height / width)}%)`;
  }, [imageDimensions, moreConstraints]);
}
