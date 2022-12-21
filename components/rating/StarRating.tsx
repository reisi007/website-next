import { MouseEvent, useCallback } from 'react';
import classNames from 'classnames';
import { ReisishotIconSizes } from '../images-next/utils/ReisishotIcons';

type Props = { starSize: ReisishotIconSizes, className?: string, halfStar: boolean, fullStars: number, totalStars: number, setStars?: (fullStars: number, halfStar: boolean) => void };

export function StarRating(
  {
    halfStar,
    fullStars,
    setStars,
    totalStars,
    starSize,
    className = '',
  }: Props,
) {
  const starClassNameBase = 'icon px-2';
  const filledStars = fullStars + (halfStar ? 1 : 0);
  const emptyStars = totalStars - filledStars;
  const editable = setStars !== undefined;
  const onClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (!editable) return;
    const targetHtmlElement = e.target as HTMLElement;
    const htlmlElementChildren = targetHtmlElement?.parentElement?.children;
    if (htlmlElementChildren == null) {
      return;
    }
    const children = Array.from(htlmlElementChildren);
    let clickedStar = children.indexOf(targetHtmlElement) + 1;

    const clickX = e.clientX;
    const targetRect = targetHtmlElement.getBoundingClientRect();

    const isHalfStar = targetRect.x + targetRect.width / 2 > clickX;
    if (isHalfStar) {
      clickedStar -= 1;
    }

    setStars(clickedStar, isHalfStar);
  }, [editable, setStars]);

  return (
    <span
      className={classNames('text-gold', className)}
    >
      {
        Array.from({ length: fullStars }, (_, idx) => idx)
          .map((i) => (
            <i
              key={i}
              onClick={(e) => onClick(e)}
              className={`${starClassNameBase} rs-star-full ${starSize}`}
            />
          ))
      }
      {
        halfStar && (
        <i
          onClick={(e) => onClick(e)}
          className={`${starClassNameBase} rs-star-half ${starSize}`}
        />
        )
      }
      {
        Array.from({ length: emptyStars }, (_, idx) => idx)
          .map((i) => (
            <i
              key={i}
              onClick={(e) => onClick(e)}
              className={`${starClassNameBase} rs-star-empty ${starSize}`}
            />
          ))
      }
    </span>
  );
}
