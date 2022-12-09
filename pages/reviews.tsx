import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAllReviews, Review } from '../components/utils/loadFiles';
import { Page } from '../components/Page';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Reviews">
      <ol>
        {reviews.map((r) => <PreviewReview key={r.id} review={r} />)}
      </ol>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Review> }> = async () => ({
  props: { reviews: (await getAllReviews()) },
});

function PreviewReview({ review }: { review: Review }) {
  return (
    <li>
      {review.id}
      :
      {' '}
      {review.greymatter.name}
    </li>
  );
}
