import Link from 'next/link';
import classNames from 'classnames';
import { useMemo } from 'react';
import { Review, ReviewProps } from '../static/loadReviews';
import { Breakpoint, Image, ImageSizes } from '../utils/Image';
import { DaysAgo } from '../utils/Age';
import { FiveStarRating } from '../rating/FiveStarRating';
import { ReisishotIconSizes } from '../utils/ReisishotIcons';

export function DisplayReviews({
  reviews,
  start = 0,
  limit = Number.MAX_VALUE,
}: { reviews: Array<Review>, start?: number, limit?: number }) {
  const imageSizes = useMemo((): ImageSizes => ({
    [Breakpoint.default]: 1,
    [Breakpoint.md]: 2,
    [Breakpoint.xl]: 3,
    [Breakpoint['2xl']]: 4,
  }), []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {
        reviews.slice(start, Math.min(start + limit, reviews.length))
          .map((r) => <PreviewReview key={r.id} review={r} imageSizes={imageSizes} />)
      }
    </div>
  );
}

export function PreviewReview({
  review,
  imageSizes,
}: { review: Review, imageSizes?: ImageSizes }) {
  const {
    id,
    frontmatter,
  } = review;

  return (
    <Link
      className={classNames(
        'black w-full',
        { 'border border-black': frontmatter.image === undefined },
      )}
      href={`reviews/${id}`}
    >
      <PreviewReviewContent {...frontmatter} imageSizes={imageSizes} />
    </Link>
  );
}

export function PreviewReviewContent({
  name,
  date,
  rating,
  image,
  imageSizes,
  className = 'h-80',
}: ReviewProps & { className?: string | undefined, imageSizes?: ImageSizes }) {
  const classes = 'absolute bg-white/30 py-2 px-4 m-0 backdrop-blur';
  return (
    <div className="relative min-h-[5rem]">
      {image !== undefined && <Image className={className} imageSizes={imageSizes} filename={image} />}
      <h3 className={classNames(classes, 'top-0 rounded-br')}>
        {name}
      </h3>
      <span className={classNames(classes, 'bottom-0 left-0 rounded-tr')}>
        <DaysAgo dateString={date} />
      </span>
      {rating !== undefined && rating > 0 && (
        <span className={classNames(classes, 'top-0 right-0 rounded-bl')}>
          <FiveStarRating starSize={ReisishotIconSizes.NORMAL} className="text-black/80" value={rating} />
        </span>
      )}
    </div>
  );
}
