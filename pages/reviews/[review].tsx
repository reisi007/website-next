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
  review: string,
  jsonData: string
}

export const getStaticProps: GetStaticProps<{ review: Review }, Params> = async (context) => {
  const reviewJson = context.params?.jsonData;
  if (reviewJson === undefined) {
    return ({ notFound: true });
  }
  const review = JSON.parse(reviewJson);
  return ({
    props: { review },
  });
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getAllReviews())
    .map((e) => ({
      params: {
        review: e.id,
        jsonData: JSON.stringify(e),
      },
    }));
  return ({
    paths,
    fallback: false,
  });
};
