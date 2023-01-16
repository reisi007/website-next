import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getMoreImages } from '../components/static/moreImages';
import { Gallery } from '../components/images-next/gallery/Gallery';
import { ImageInfo, MetadataMap } from '../components/images-next/types/ImageTypes';
import { readMultipleImages } from '../components/static/readImage';
import { PortfolioPage } from '../components/PortfolioPage';
import Markdown from '../components/text/vision.mdx';

export default function Vision({
  caroussel,
  moreImages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PortfolioPage title="Dein Leben - Deine Bilder">
      <Markdown caroussel={caroussel} />
      <Gallery className="mt-4" images={moreImages} />
    </PortfolioPage>
  );
}

const FIRST_CAROUSSEL = [
  'SarahFrick007', 'AnnaWirth07', 'JuliaEder009', 'Boudoir0021',
] as const;
type FirstCarousselType = typeof FIRST_CAROUSSEL[number];
export const getStaticProps: GetStaticProps<{ caroussel: MetadataMap<FirstCarousselType>, moreImages: Array<[string, ImageInfo]> }> = async () => ({
  props: {
    caroussel: await readMultipleImages([...FIRST_CAROUSSEL]),
    moreImages: await getMoreImages(),
  },
});
