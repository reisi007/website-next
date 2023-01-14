import Link from 'next/link';
import classNames from 'classnames';
import { Testimonial, TestimonialProps } from '../images-next/types/TestimonialTypes';
import { Styleable } from '../images-next/types/Styleable';
import { DaysAgo } from '../images-next/utils/Age';
import { ReisishotIcon, ReisishotIcons } from '../images-next/utils/ReisishotIcons';
import { Breakpoint, ImageBreakpoints, Image } from '../images-next/utils/Image';

const REVIEW_PREVIEW_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 2,
  [Breakpoint.xl]: 2,
  [Breakpoint['2xl']]: 3,
};
export function DisplayReviews({
  reviews,
  start = 0,
  limit = Number.MAX_VALUE,
}: { reviews: Array<Testimonial>, start?: number, limit?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
      {
        reviews.slice(start, Math.min(start + limit, reviews.length))
          .map((r) => <PreviewReview key={r.id} review={r} breakpoints={REVIEW_PREVIEW_BREAKPOINTS} />)
      }
    </div>
  );
}

export function PreviewReview({
  review,
  breakpoints,
}: { review: Testimonial, breakpoints?: ImageBreakpoints }) {
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
      <PreviewReviewContent
        {...frontmatter}
        className="h-8"
        breakpoints={breakpoints}
      />
    </Link>
  );
}

export function PreviewReviewContent({
  name,
  date,
  rating,
  image,
  breakpoints,
  style,
  className,
}: TestimonialProps & Partial<Styleable> & { breakpoints?: ImageBreakpoints }) {
  const classes = 'absolute bg-black/30 text-white py-2 px-4 m-0 backdrop-blur';
  return (
    <div style={style} className="relative h-full min-h-[5rem]">
      {image !== undefined && <Image className={className} breakpoints={breakpoints} filename={image} />}
      <span className={classNames(classes, 'top-0 rounded-br')}>
        {name}
      </span>
      <span className={classNames(classes, 'bottom-0 left-0 rounded-tr')}>
        <DaysAgo dateString={date} />
      </span>
      {rating !== undefined && rating > 0 && (
        <span className={classNames(classes, 'top-0 right-0 rounded-bl')}>
          {rating / 20}
          {' '}
          <ReisishotIcon className="text-gold" icon={ReisishotIcons.Star_full} />
        </span>
      )}
    </div>
  );
}
