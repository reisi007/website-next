import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import { asyncFlatMap } from './asyncFlatMap';

type ReviewProps = {
  image?: string
  name: string
  video?: string
  date: string
  rating?: string
  type: 'business' | 'beauty' | 'boudoir' | 'couples' | 'live' | 'sport'
};
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

  const allReviewa: Array<Review> = filePaths.map((fullPath) => {
    // Remove ".md" from file name to get id
    const fileName = path.basename(fullPath);
    const id = fileName.replace(/\.review.md$/, '');

    // Read markdown file as string
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    const greymatter = {
      ...matterResult.data,
      date: matterResult.data.date.toString(),
    } as ReviewProps;
    return {
      id,
      html: markdown2html.render(matterResult.content),
      greymatter,
    };
  });
  // Sort posts by date
  return allReviewa.sort((a, b) => b.greymatter.date.localeCompare(a.greymatter.date));
}
