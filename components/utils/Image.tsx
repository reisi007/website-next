import ExportedImage from 'next-image-export-optimizer';
import classNames from 'classnames';

export function Image({
  className,
  filename,
}: { filename: string, className?: string }) {
  return (
    <div className={classNames('relative max-h-[90vh]', className)}>
      <ExportedImage
        className={classNames('object-contain')}
        fill
        src={`/images/${filename}.jpg`}
        alt={`${filename}.jpg`}
      />
    </div>
  );
}
