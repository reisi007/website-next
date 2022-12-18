import classNames from 'classnames';
import { CSSProperties, useMemo } from 'react';
import { AbstractCaroussel } from './AbstractCaroussel';
import { useImagePadding, Image } from '../utils/Image';
import { ImageInfo, MetadataMap } from '../static/readImage';
import { Styleable } from '../types/Styleable';

export function ImageCaroussel<T extends string>({
  metadataMap,
  intervalMs = 7500,
  className,
  style,
}: { intervalMs?: number, metadataMap: MetadataMap<T> } & Partial<Styleable>) {
  const classes = classNames(className, 'rounded-lg');
  const items = useMemo(() => Object.keys(metadataMap) as Array<T>, [metadataMap]);
  const string = Object.keys(metadataMap)[0] as T;
  const containerImageMetadata = metadataMap[string];
  const paddingTop = useImagePadding(containerImageMetadata?.size);
  const myStyle: CSSProperties = useMemo(() => {
    if (style === undefined) {
      return { paddingTop };
    }
    return style;
  }, [paddingTop, style]);

  const containerImageInfo = style === myStyle ? undefined : containerImageMetadata;

  return (
    <AbstractCaroussel<T> style={myStyle} intervalMs={intervalMs} className={classes} items={items}>
      {(cur) => {
        const metadata = metadataMap[cur];
        return <CurImage className={classes} containerImageInfo={containerImageInfo} filename={cur} imageInfo={metadata} />;
      }}
    </AbstractCaroussel>
  );
}

function CurImage({
  imageInfo,
  containerImageInfo,
  filename,
  className,
}: { imageInfo: ImageInfo, containerImageInfo?: ImageInfo, filename: string, className: string }) {
  return <Image className={className} alt={imageInfo?.metadata?.title} imageDimensions={(containerImageInfo ?? imageInfo).size} filename={filename} />;
}
