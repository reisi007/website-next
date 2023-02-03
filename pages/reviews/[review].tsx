import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { FiveStarRating } from '../../components/images-next/rating/FiveStarRating';
import { getAllReviews } from '../../components/images-next/static/loadReviews';
import { Image } from '../../components/images-next/utils/Image';
import { ReisishotIconSizes } from '../../components/images-next/utils/ReisishotIcons';
import { RawHtml } from '../../components/images-next/utils/RawHtml';
import { FormattedDate } from '../../components/images-next/utils/Age';
import { Testimonial } from '../../components/images-next/types/TestimonialTypes';
import { ImageInfo } from '../../components/images-next/types/ImageTypes';
import { StyledLinkButton } from '../../components/images-next/button/StyledButton';
import { readImage } from '../../components/static/readImage';
import styles from '../../components/images-next/utils/Utils.module.css';
import { WebPage } from '../../components/WebPage';

export default function SingleReview({
  review,
  imageInfo,
  previousId,
  nextId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const {
    frontmatter,
    html,
  } = review;
  const {
    name,
    image,
    rating,
    date,
  } = frontmatter;
  const size = imageInfo?.size;
  const alt = imageInfo?.metadata?.title;
  return (
    <WebPage title={`Review von ${name}`} keywords={['Review', 'Bewertung', name]}>
      {image !== undefined && size !== undefined && <Image alt={alt} size={size} className="w-full" filename={image} />}
      {rating !== undefined && <FiveStarRating className="mt-4 flex justify-center text-gold" starSize={ReisishotIconSizes.XXLARGE} value={rating} />}
      {html !== null && <RawHtml html={html} className={styles.firstLetter} />}
      <div className="flex justify-end">
        <span className="mr-2">
          {name}
          {' '}
          am
          {' '}
          <FormattedDate dateString={date} />
        </span>
      </div>
      <div className="my-6 grid grid-cols-1 gap-x-2 md:grid-cols-2">
        <StyledLinkButton href={`/reviews/${previousId}`} disabled={previousId === null} className="my-2">Vorheriger</StyledLinkButton>
        <StyledLinkButton href={`/reviews/${nextId}`} disabled={nextId === null} className="my-2 bg-primary text-onPrimary">Nächster</StyledLinkButton>
        <StyledLinkButton href="/reviews" className="my-2 md:col-span-2">Zur Übersicht</StyledLinkButton>
      </div>
    </WebPage>
  );
}

interface PathParams extends ParsedUrlQuery {
  review: string;
}

type PropParams = { review: Testimonial, imageInfo: ImageInfo | null, previousId: string | null, nextId: string | null };

export const getStaticProps: GetStaticProps<PropParams, PathParams> = async (context) => {
  const reviews = await getAllReviews();
  const reviewIndex = reviews.findIndex((r) => r.id === context.params?.review);

  if (reviewIndex < 0) {
    return { notFound: true };
  }
  const review = reviews[reviewIndex];
  // Previous and next are "wrong" -> next is the older one and previous is the newer one as "next" should be the primary one
  const previousId = reviews[reviewIndex - 1]?.id ?? null;
  const nextId = reviews[reviewIndex + 1]?.id ?? null;
  const imageFilename = review.frontmatter.image;

  const props: PropParams = {
    review,
    previousId,
    nextId,
    imageInfo: imageFilename === undefined ? null : await readImage(imageFilename),
  };
  return {
    props,
  };
};

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const reviews = await getAllReviews();
  const paths: Array<{ params: PathParams }> = reviews.map((e) => ({
    params: { review: e.id },
  }));
  return {
    paths,
    fallback: false,
  };
};
