import classNames from 'classnames';
import { useMemo } from 'react';
import { AbstractCaroussel } from './AbstractCaroussel';
import { buildImagePadding, Image } from '../utils/Image';
import { MetadataMap } from '../static/readImage';
import { Styleable } from '../types/Styleable';

export function ImageCaroussel({
  metadataMap,
  intervalMs = 7500,
  className,
  style = { paddingTop: buildImagePadding(metadataMap[0]?.size) },
}: { intervalMs?: number, metadataMap:MetadataMap } & Partial<Styleable>) {
  const classes = classNames(className, 'rounded-lg');
  const items = useMemo(() => Object.keys(metadataMap), [metadataMap]);
  return (
    <AbstractCaroussel style={style} intervalMs={intervalMs} className={classes} items={items}>
      {(cur) => {
        const metadata = metadataMap[cur];
        return <Image className={classes} alt={metadata?.metadata?.title} imageDimensions={metadata?.size} filename={cur} />;
      }}
    </AbstractCaroussel>
  );
}
