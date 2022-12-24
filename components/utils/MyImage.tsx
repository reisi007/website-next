import { Image } from '../images-next/utils/Image';
import { ImageSize } from '../images-next/types/ImageTypes';

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
