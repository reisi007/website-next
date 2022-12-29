import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { FiveStarRating } from '../components/images-next/rating/FiveStarRating';
import { DisplayReviews } from '../components/review/DisplayReviews';
import { getAllReviews } from '../components/images-next/static/loadReviews';
import { Review } from '../components/images-next/types/ReviewTypes';
import { ReisishotIconSizes } from '../components/images-next/utils/ReisishotIcons';
import { PortfolioPage } from '../components/PortfolioPage';

export default function Home({
  avgRating,
  cnt,
  reviews,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PortfolioPage title="Fotograf Florian Reisinger" keywords={['Fotograf', 'Linz', 'Beauty']}>

      <DisplayReviews reviews={reviews} limit={4} />

      <StarLinkToReview cnt={cnt} avgRating={avgRating} />

      <DisplayReviews reviews={reviews} start={4} limit={4} />
    </PortfolioPage>
  );
}

function StarLinkToReview({
  avgRating,
  cnt,
}: Pick<InferGetStaticPropsType<typeof getStaticProps>, 'avgRating' | 'cnt'>) {
  return (
    <Link href="/reviews" className="black mx-4">
      <div className="text-center text-xl">Schau dir noch mehr Bewertungen von Frauen an, die schon vor meiner Kamera gestanden sind</div>
      <div className="flex items-center justify-center">
        <FiveStarRating className="inline-flex justify-center" starSize={ReisishotIconSizes.XXLARGE} value={avgRating} />
        <span className="text-3xl">
          (
          {cnt}
          )
        </span>
      </div>
    </Link>
  );
}

export const getStaticProps: GetStaticProps<{ avgRating: number, cnt: number, reviews: Array<Review> }> = async () => {
  const reviews = await getAllReviews();
  const reviewWithRating = reviews.filter((r) => r.frontmatter.rating ?? -1 > 0);
  const cnt = reviewWithRating.length;
  const sum = reviewWithRating.map((r) => r.frontmatter.rating ?? 0)
    .reduce((pV, cV) => pV + cV, 0);
  return {
    props: {
      avgRating: sum / cnt,
      cnt,
      reviews: reviews.slice(0, 12),
    },
  };
};
