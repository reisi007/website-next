import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import classNames from 'classnames';
import { FiveStarRating } from '../components/images-next/rating/FiveStarRating';
import { DisplayReviews } from '../components/review/DisplayReviews';
import { getAllReviews } from '../components/images-next/static/loadReviews';
import { Testimonial } from '../components/images-next/types/TestimonialTypes';
import { ReisishotIconSizes } from '../components/images-next/utils/ReisishotIcons';
import { PortfolioPage } from '../components/PortfolioPage';
import { Styleable } from '../components/images-next/types/Styleable';

export default function Home({
  avgRating,
  cnt,
  reviews,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PortfolioPage
      title="Fotograf Florian Reisinger"
      keywords={['Fotograf', 'Linz', 'Beauty']}
      description={`Dein Leben - Deine Bilder
Möchtest du besondere Momente einfangen und außergewöhnliche Bilder erhalten?
Erfahre hier ${cnt} Gründe`}
    >
      <Head>
        <meta name="google-site-verification" content="WzDto29AqxoBHzInsq0NZnNhkrP26qqIsFPQmtBiCKw" />
      </Head>
      <DisplayReviews reviews={reviews} limit={4} />

      <StarLinkToReview className="p" cnt={cnt} avgRating={avgRating} />

      <DisplayReviews reviews={reviews} start={4} limit={4} />
    </PortfolioPage>
  );
}

function StarLinkToReview({
  avgRating,
  cnt,
  className,
}: Pick<InferGetStaticPropsType<typeof getStaticProps>, 'avgRating' | 'cnt'> & Pick<Styleable, 'className'>) {
  return (
    <Link href="/reviews" className={classNames('black mx-4', className)}>
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

export const getStaticProps: GetStaticProps<{ avgRating: number, cnt: number, reviews: Array<Testimonial> }> = async () => {
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
