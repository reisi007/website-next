import { promisify } from 'util';
import path from 'path';
import image_size from 'image-size';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';
import { promises as fs } from 'fs';
import { asyncMap } from '../utils/asyncFlatMap';

const sizeOf = promisify(image_size);
const imageDirectory = path.join(process.cwd(), 'public', 'images');
export type ImageInfo = { size: ISizeCalculationResult, metadata: Metadata };
export type Metadata = { title: string, tags: Array<string> };
export type MetadataMap = { [key: string]: ImageInfo };

export async function readImage(filename: string): Promise<ImageInfo> {
  const size = await sizeOf(path.join(imageDirectory, `${filename}.jpg`));
  if (size === undefined) throw Error(`Image ${filename} not found!`);
  const metadata = JSON.parse(await fs.readFile(path.join(imageDirectory, `${filename}.json`), 'utf8'));
  return {
    size,
    metadata,
  };
}

export async function readMultipleImages(filename: Array<string>): Promise<MetadataMap> {
  return Object.fromEntries(await asyncMap(filename, async (f): Promise<[string, ImageInfo]> => [f, await readImage(f)]));
}
