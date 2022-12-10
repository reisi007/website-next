import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import dayjs from 'dayjs';
import { asyncFlatMap, asyncMap } from '../utils/asyncFlatMap';
import { TEMPLATE_STRING_AS_DATE } from '../utils/Age';

export type ReviewProps = {
  image?: string
  name: string
  date: string
  rating?: number
  type: typeof REVIEW_TYPES[number]
};

const REVIEW_TYPES = ['business', 'beauty', 'boudoir', 'pärchen', 'live', 'sport'] as const;

export type Review = {
  id: string
  greymatter: ReviewProps
  html: string | null
};

const { readdir } = fs.promises;

const postsDirectory = path.join(process.cwd(), 'private', 'reviews');

async function loadReviews() {
  const folders = await readdir(postsDirectory);
  const filePaths = await asyncFlatMap(folders, async (folderName) => {
    const baseFolder = path.join(postsDirectory, folderName);
    return (await readdir(baseFolder))
      .map((e) => path.join(baseFolder, e));
  });

  const markdown2html = md();

  function createReviewProps(matterResult: matter.GrayMatterFile<string>) {
    if (!(matterResult.data.date instanceof Date)) {
      throw new Error('Datum kann nicht als Datum geparst werden');
    }
    const data: { [key: string]: unknown } = {
      ...matterResult.data,
      date: dayjs(matterResult.data.date)
        .format(TEMPLATE_STRING_AS_DATE),
    };

    if (typeof data.name !== 'string') throw new Error('Name ist nicht vorhanden');
    const type = data?.type as (typeof REVIEW_TYPES[number]) | undefined;
    if (type !== undefined && !REVIEW_TYPES.includes(type)) throw new Error(`Type ${type} is not included in ${REVIEW_TYPES.join(', ')}`);

    return data as ReviewProps;
  }

  const allReviewa: Array<Review> = await asyncMap(filePaths, async (fullPath) => {
    // Remove ".md" from file name to get id
    const fileName = path.basename(fullPath);
    const id = fileName.replace(/\.review.md$/, '');

    // Read markdown file as string
    const fileContents = await fs.promises.readFile(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const content = matterResult.content.trim();

    // Combine the data with the id
    const greymatter = createReviewProps(matterResult);
    return {
      id,
      html: content.length === 0 ? null : markdown2html.render(content),
      greymatter,
    };
  });
  return allReviewa;
}

export async function getAllReviews(): Promise<Array<Review>> {
  const allReviewa = await loadReviews();
  // Sort posts by date
  return allReviewa.sort((a, b) => {
    const aMatter = a.greymatter;
    const bMatter = b.greymatter;

    function hasMedia(props: ReviewProps): Boolean {
      return props.image !== undefined;
    }

    // Image / video und dann html is undefined ( true dann false)
    const hasMediaA = hasMedia(aMatter);
    const hasMediaB = hasMedia(bMatter);

    if (hasMediaA !== hasMediaB) {
      if (hasMediaA) {
        return -1;
      }
      return 1;
    }

    const aHtmlNull = a.html === null;
    const bHtmlNull = b.html === null;

    if (aHtmlNull !== bHtmlNull) {
      if (aHtmlNull) {
        return 1;
      }
      return -1;
    }

    // Date (descending)
    const date = b.greymatter.date.localeCompare(a.greymatter.date);
    if (date !== 0) {
      return date;
    }

    // Has text
    const aHtml = a.html?.length ?? -1;
    const bHtml = b.html?.length ?? -1;
    if (aHtml !== bHtml) {
      if (aHtml > bHtml) {
        return -1;
      }
      return 1;
    }

    // Has rating
    const aRating = aMatter.rating ?? -1;
    const bRating = bMatter.rating ?? -1;
    if (aRating !== bRating) {
      if (aRating > bRating) {
        return 1;
      }

      return -1;
    }

    return 0;
  });
}
