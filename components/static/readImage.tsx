import { promisify } from 'util';
import path from 'path';
import image_size from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

export async function readImage(filename: string): Promise<ISizeCalculationResult> {
  const size = await sizeOf(path.join(imageDirectory, `${filename}.jpg`));
  if (size === undefined) throw Error(`Image ${filename} not found!`);
  return size;
}

const sizeOf = promisify(image_size);

const imageDirectory = path.join(process.cwd(), 'public', 'images');
