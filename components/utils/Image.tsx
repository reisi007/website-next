import ExportedImage from 'next-image-export-optimizer';
import classNames from 'classnames';
import { useLink } from './useLink';

export function Image({
  className,
  filename,
  imageSizes,
}: { filename: string, className?: string, imageSizes?:ImageSizes }) {
  const src = useLink(`images/${filename}.jpg`);
  return (
    <div className={classNames('relative max-h-[90vh]', className)}>
      <ExportedImage
        className={classNames('object-contain')}
        fill
        src={src}
        alt={`${filename}.jpg`}
        sizes={buildSizeString(imageSizes)}
      />
    </div>
  );
}

export type ImageSizes = Partial<Record<Breakpoint, number>> & { [Breakpoint.default]:number };

export enum Breakpoint {
  '2xl' = 1320,
  xl = 1140,
  lg = 960,
  md = 720,
  sm = 540,
  default = 0,
}

function buildSizeString(data?: ImageSizes):string | undefined {
  if (data === undefined) return undefined;

  return Object.entries(data)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([key, cnt]) => {
      if (key === '0') return `${100 / cnt}vw`;
      return `(max-width: ${key}px) ${100 / cnt}vw`;
    })
    .join(',');
}
