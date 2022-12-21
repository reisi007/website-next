import { useCallback, useMemo } from 'react';
import { StarRating } from './StarRating';
import { ReisishotIconSizes } from '../images-next/utils/ReisishotIcons';

type FiveStarRatingProps = {
  starSize: ReisishotIconSizes,
  className?: string,
  value: number,
  onChange?: (value: number) => void
};

export function FiveStarRating({
  starSize,
  className,
  value,
  onChange,
}: FiveStarRatingProps) {
  const [fullStars, isHalfStar] = useMemo(() => {
    let full = Math.floor(value / 20);
    const remainder = value - (full * 20);
    let isHalf = false;
    if (remainder >= 15) full += 1;
    else isHalf = remainder >= 10;
    return [full, isHalf];
  }, [value]);

  const onClick = useCallback((full: number, half: boolean): void => {
    const nextValue = 20 * full + (half ? 10 : 0);
    if (onChange) {
      onChange(nextValue);
    }
  }, [onChange]);

  return <StarRating className={className} starSize={starSize} halfStar={isHalfStar} fullStars={fullStars} totalStars={5} setStars={onChange === undefined ? undefined : onClick} />;
}
