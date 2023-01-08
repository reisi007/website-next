import { ReactNode } from 'react';
import { LoadedReview } from './reviews.api';
import { Card } from '../../images-next/utils/Card';
import { Badge } from '../../images-next/utils/Badge';
import { DaysAgo } from '../../images-next/utils/Age';
import { FiveStarRating } from '../../images-next/rating/FiveStarRating';
import { ReisishotIconSizes } from '../../images-next/utils/ReisishotIcons';

export function Review({
  name,
  email,
  creation_date: creationDate,
  review_private: privateReview = '',
  review_public: publicReview = '',
  rating,
  className,
  children,
}: LoadedReview & { className?: string, children?: ReactNode }) {
  return (
    <Card className={className}>
      <h2 className="mb-2">
        {name}
        {' '}
        (
        {email}
        )
      </h2>
      <div className="flex justify-center">
        <Badge><DaysAgo dateString={creationDate} /></Badge>
      </div>
      {!!rating && (
        <FiveStarRating
          className="mt-2 -mb-2 text-center"
          starSize={ReisishotIconSizes.XLARGE}
          value={rating}
        />
      )}
      {!!privateReview && (
        <>
          <h3 className="mt-4 font-medium">Private Bewertung</h3>
          <p className="whitespace-pre-line text-center">{privateReview}</p>
        </>
      )}
      {!!publicReview && (
        <>
          <h3 className="mt-4 font-medium">Öffentliche Bewertung</h3>
          <p className="whitespace-pre-line text-center">{publicReview}</p>
        </>
      )}
      <div className="grow" />
      {children !== undefined && children}
    </Card>
  );
}
