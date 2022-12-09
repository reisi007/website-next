import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { getAllReviews, Review } from '../components/utils/loadFiles';
import { Page } from '../components/Page';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Reviews">
      <>
        {reviews.map((r) => <PreviewReview key={r.id} review={r} />)}
      </>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Review> }> = async () => ({
  props: { reviews: (await getAllReviews()) },
});

function PreviewReview({ review }: { review: Review }) {
  const {
    id,
    greymatter,
  } = review;
  const {
    name,
    date,
    rating,
    image,
  } = greymatter;
  return (
    <Link href={`reviews/${review.id}`}>
      <h3>{name}</h3>
    </Link>
  );
}
