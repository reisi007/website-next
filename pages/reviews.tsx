import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAllReviews, Review } from '../components/static/loadReviews';
import { Page } from '../components/page/Page';
import { PreviewReview } from '../components/review/PreviewReview';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page className="flex flex-wrap" title="Reviews">
      <>
        {reviews.map((r) => <PreviewReview key={r.id} review={r} />)}
      </>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Review> }> = async () => ({
  props: { reviews: await getAllReviews() },
});
