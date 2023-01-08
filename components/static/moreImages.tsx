import path from 'path';
import { promises as fs } from 'fs';
import { DIRECTORY_IMAGE } from '../images-next/static/readImageInternal';
import { getAllReviews } from '../images-next/static/loadReviews';
import { hasAdvertisedCategory } from '../images-next/types/TestimonialTypes';
import { readMultipleImages } from './readImage';
import { SORT_NEWEST_TO_OLDEST } from '../images-next/utils/Image';

function isNotUndefined<T>(e: T | undefined): e is T {
  return e !== undefined;
}

export async function getMoreImages() {
  const imagesFromReview = (await getAllReviews())
    .filter((e) => hasAdvertisedCategory(e.frontmatter))
    .map((e) => e.frontmatter.image)
    .filter(isNotUndefined);
  return internalLoadMoreImages(imagesFromReview);
}

async function internalLoadMoreImages(additional: Array<string>) {
  const subfolder = 'more';
  const moreFolder = path.join(DIRECTORY_IMAGE, subfolder);
  const files = (await fs.readdir(moreFolder))
    .filter((i) => i.endsWith('.jpg'))
    .map((i) => path.join(subfolder, i.substring(0, i.lastIndexOf('.'))));
  const imagesToLoad = [...additional, ...files];
  const images = await readMultipleImages(imagesToLoad);
  return Object.entries(images)
    .sort(SORT_NEWEST_TO_OLDEST);
}
