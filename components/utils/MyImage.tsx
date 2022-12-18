import { ImageSize } from 'ts-exif-parser';
import { Image } from './Image';

const DIMENSION_SQUARE: ImageSize = {
  width: 1,
  height: 1,
};

export function MyImage() {
  return (
    <div className="flex justify-center">
      <div className="w-60">
        <Image alt="Bild des Fotografen" imageDimensions={DIMENSION_SQUARE} filename="me" />
      </div>
    </div>
  );
}
