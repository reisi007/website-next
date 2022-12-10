import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { Page } from '../components/page/Page';
import { ImageCaroussel } from '../components/caroussel/ImageCaroussel';
import { getAllReviews } from '../components/static/loadReviews';
import { FiveStarRating } from '../components/rating/FiveStarRating';
import { ReisishotIconSizes } from '../components/utils/ReisishotIcons';

function StarLinkToReview({ avgRating, cnt }:InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Link href="/reviews" className="black mx-4">
      <p className="text-center text-xl">Lies dir Bewertungen von bestehenden Kunden durch</p>
      <div className="flex items-center justify-center">
        <FiveStarRating starSize={ReisishotIconSizes.XXLARGE} value={avgRating} />
        <span className="text-3xl">
          (
          {cnt}
          )
        </span>
      </div>
    </Link>
  );
}

export default function Home({ avgRating, cnt }:InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Fotograf Florian Reisinger">
      <ImageCaroussel
        intervalMs={7500}
        items={[
          'AnnaWirth07',
          'AnnaWirth12',
          'Frau18',
        ]}
      />

      <StarLinkToReview cnt={cnt} avgRating={avgRating} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps<{ avgRating: number, cnt:number }> = async () => {
  const reviews = await getAllReviews();
  const reviewWithRating = reviews.filter((r) => r.frontmatter.rating ?? -1 > 0);
  const cnt = reviewWithRating.length;
  const sum = reviewWithRating.map((r) => r.frontmatter.rating ?? 0)
    .reduce((pV, cV) => pV + cV, 0);
  return {
    props: { avgRating: sum / cnt, cnt },
  };
};
