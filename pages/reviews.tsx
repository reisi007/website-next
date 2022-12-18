import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAllReviews, Review } from '../components/static/loadReviews';
import { Page } from '../components/page/Page';
import { DisplayReviews } from '../components/review/DisplayReviews';

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
