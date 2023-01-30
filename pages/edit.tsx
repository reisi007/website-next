import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { MultipleBeforeAfterImages } from '../components/images-next/beforeAfter/BeforeAfterImage';
import { ImageInfo } from '../components/images-next/types/ImageTypes';
import { readMultipleImages } from '../components/static/readImage';
import { WebPage } from '../components/WebPage';
import Markdown from '../components/text/edit.mdx';

export default function Edit(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <WebPage title="Besondere Momente - Außergewöhnliche Bilder">
      <>
        <Markdown />
        <MultipleBeforeAfterImages data={props} />
      </>
    </WebPage>
  );
}

const IMAGES = [
  'AnnaWirth08',
  'Boudoir0004',
  'Boudoir0012',
  'Boudoir0021',
  'Boudoir0023',
  'EvaMair006',
  'Eva-und-Kevin008',
  'Frau08',
  'SandraF09',
  'JohannaKartusch023',
] as const;
type ImageNames = typeof IMAGES[number];
export const getStaticProps: GetStaticProps<Record<ImageNames, ImageInfo>> = async () => ({
  props: await readMultipleImages([...IMAGES]),
});
