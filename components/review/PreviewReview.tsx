import Link from 'next/link';
import classNames from 'classnames';
import { Review, ReviewProps } from '../static/loadReviews';
import { Image } from '../utils/Image';
import { DaysAgo } from '../utils/Age';
import { FiveStarRating } from '../rating/FiveStarRating';
import { ReisishotIconSizes } from '../utils/ReisishotIcons';

export function PreviewReview({ review }: { review: Review }) {
  const {
    id,
    frontmatter,
  } = review;

  return (
    <Link
      className={classNames(
        'black w-full md:w-1/2 xl:w-1/3 xxl:w-1/4',
        { 'border border-black': frontmatter.image === undefined },
      )}
      href={`reviews/${id}`}
    >
      <PreviewReviewContent {...frontmatter} />
    </Link>
  );
}

export function PreviewReviewContent({
  name,
  date,
  rating,
  image,
  className = 'h-80',
}: ReviewProps & { className?: string | undefined }) {
  const classes = 'absolute bg-white/30 py-2 px-4 m-0 backdrop-blur';
  return (
    <div className="relative min-h-[5rem]">
      {image !== undefined && <Image className={className} filename={image} />}
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
