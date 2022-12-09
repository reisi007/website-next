import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Page } from '../../components/Page';
import { getAllReviews, Review } from '../../components/utils/loadFiles';

export default function SingleReview({ review }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { name } = review.greymatter;
  return (
    <Page title={`Review von ${name}`}>
      <div>{name}</div>
    </Page>
  );
}

interface Params extends ParsedUrlQuery {
  review: string;
}

export const getStaticProps: GetStaticProps<{ review: Review }, Params> = async (context) => {
  const review = (await getAllReviews()).find((e) => e.id === context.params?.review);
  if (review === undefined) {
    return ({ notFound: true });
  }
  return ({
    props: { review },
  });
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getAllReviews())
    .map((e) => ({
      params: { review: e.id },
    }));
  return ({
    paths,
    fallback: false,
  });
};
