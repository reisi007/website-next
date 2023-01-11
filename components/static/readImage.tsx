import path from 'path';
import { readImageInternal, readMultipleImagesInternal } from '../images-next/static/readImageInternal';

const METADATA_DIR = path.join(process.cwd(), '..', 'gallery-next', 'private', 'images');

export async function readImage(filename:string) {
  return readImageInternal(filename, METADATA_DIR);
}

export async function readMultipleImages<F extends string>(filename:Array<F>) {
  return readMultipleImagesInternal(filename, METADATA_DIR);
}
