import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DisplayReviews } from '../components/review/DisplayReviews';
import { getAllReviews } from '../components/images-next/static/loadReviews';
import { Review } from '../components/images-next/types/ReviewTypes';
import { PortfolioPage } from '../components/PortfolioPage';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PortfolioPage title="Reviews" keywords={['Bewertung', 'Fotoshooting', 'Bewertungen', 'Fotograf']}>
      <DisplayReviews reviews={reviews} />
    </PortfolioPage>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Review> }> = async () => ({
  props: { reviews: await getAllReviews() },
});
