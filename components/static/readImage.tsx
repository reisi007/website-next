import path from 'path';
import { promises as fs } from 'fs';
import { ExifParserFactory, ImageSize } from 'ts-exif-parser';
import { asyncMap } from '../utils/asyncFlatMap';

const imageDirectory = path.join(process.cwd(), 'public', 'images');
const imageMetadataDirectory = path.join(process.cwd(), 'private', 'images');

export type ImageInfo = { size: ImageSize, metadata: Metadata };
export type Metadata = JsonMetadata & { created?: number };
type JsonMetadata = { title: string, tags: Array<string> };
export type MetadataMap<F extends string> = Record<F, ImageInfo>;

export async function readImage(filename: string): Promise<ImageInfo> {
  const imageFile = path.join(imageDirectory, `${filename}.jpg`);
  const parser = ExifParserFactory.create(await fs.readFile(imageFile));
  parser.enableBinaryFields(true);
  parser.enableTagNames(true);
  parser.enableImageSize(true);
  parser.enableReturnTags(true);
  const exif = parser.parse();
  if (exif === undefined) throw Error(`Image ${filename} not found!`);
  const jsonMetadata: JsonMetadata = JSON.parse(await fs.readFile(path.join(imageMetadataDirectory, `${filename}.json`), 'utf8'));
  const metadata: Metadata = {
    ...jsonMetadata,
    created: exif.tags?.CreateDate,
  };
  return {
    size: exif.getImageSize(),
    metadata,
  };
}

export async function readMultipleImages<F extends string>(filename: Array<F>): Promise<MetadataMap<F>> {
  const entries: Array<readonly[F, ImageInfo]> = await asyncMap(filename, async (f) => [f, await readImage(f)] as const);
  return Object.fromEntries(entries) as MetadataMap<F>;
}
