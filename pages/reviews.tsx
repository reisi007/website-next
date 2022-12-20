import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DisplayReviews } from '../components/review/DisplayReviews';
import { getAllReviews } from '../components/images-next/static/loadReviews';
import {Page} from '../components/images-next/page/Page';
import {Review} from '../components/images-next/types/ReviewTypes';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Reviews" keywords={['Bewertung', 'Fotoshooting', 'Bewertungen', 'Fotograf']}>
      <DisplayReviews reviews={reviews} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Review> }> = async () => ({
  props: { reviews: await getAllReviews() },
});
