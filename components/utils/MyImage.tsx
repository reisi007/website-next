import { ImageSize } from 'ts-exif-parser';
import { Image } from '@reisisoft/images-next';

const SQUARE_SIZE: ImageSize = {
  width: 1,
  height: 1,
};

export function MyImage() {
  return (
    <div className="flex justify-center">
      <div className="w-60">
        <Image alt="Bild des Fotografen" size={SQUARE_SIZE} filename="me" />
      </div>
    </div>
  );
}
