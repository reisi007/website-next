import path from 'path';
import { DIRECTORY_IMAGE, readImageInternal, readMultipleImagesInternal } from '../images-next/static/readImageInternal';

const METADATA_DIR = path.join(process.cwd(), '..', 'gallery-next', 'public', 'images');

export async function readImage(filename:string) {
  return readImageInternal(filename, DIRECTORY_IMAGE, METADATA_DIR);
}

export async function readMultipleImages<F extends string>(filename:Array<F>) {
  return readMultipleImagesInternal(filename, DIRECTORY_IMAGE, METADATA_DIR);
}
