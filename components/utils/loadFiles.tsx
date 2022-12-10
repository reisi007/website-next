import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import { asyncFlatMap, asyncMap } from './asyncFlatMap';

type ReviewProps = {
  image?: string
  name: string
  video?: string
  date: string
  rating?: number
  type: typeof REVIEW_TYPES[number]
};

const REVIEW_TYPES = ['business', 'beauty', 'boudoir', 'pärchen', 'live', 'sport'] as const;

export type Review = {
  id: string
  greymatter: ReviewProps
  html: string
};

const { readdir } = fs.promises;

const postsDirectory = path.join(process.cwd(), 'private', 'reviews');

export async function getAllReviews(): Promise<Array<Review>> {
  const folders = await readdir(postsDirectory);
  const filePaths = await asyncFlatMap(folders, async (folderName) => {
    const baseFolder = path.join(postsDirectory, folderName);
    return (await readdir(baseFolder))
      .map((e) => path.join(baseFolder, e));
  });

  const markdown2html = md();

  function extracted(matterResult: matter.GrayMatterFile<string>) {
    if (!(matterResult.data.date instanceof Date)) {
      throw new Error('Datum kann nicht als Datum geparst werden');
    }
    const data: { [key: string]: unknown } = {
      ...matterResult.data,
      date: matterResult.data.date.toString(),
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

    // Combine the data with the id
    const greymatter = extracted(matterResult);
    return {
      id,
      html: markdown2html.render(matterResult.content),
      greymatter,
    };
  });
  // Sort posts by date
  return allReviewa.sort((a, b) => {
    const aMatter = a.greymatter;
    const bMatter = b.greymatter;

    function hasMedia(props: ReviewProps): Boolean {
      return props.image === undefined && props.video === undefined;
    }

    // Image / video und dann html is undefined ( true dann false)
    const nullA = hasMedia(aMatter);
    const nullB = hasMedia(bMatter);

    if (nullA !== nullB) {
      if (nullA) {
        return 1;
      }

      return -1;
    }

    const htmlANull = a.html.length === 0;
    const htmlBNull = b.html.length === 0;

    if (htmlANull !== htmlBNull) {
      if (htmlANull) {
        return 1;
      }

      return -1;
    }

    // Date (descending)
    const date = b.greymatter.date.localeCompare(a.greymatter.date);
    if (date !== 0) {
      return date;
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

    // Has text
    const aHtml = a.html.length;
    const bHtml = b.html.length;
    if (aHtml !== bHtml) {
      if (aHtml > bHtml) {
        return 1;
      }

      return -1;
    }
    return 0;
  });
}
