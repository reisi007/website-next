import {
  ReactNode, useCallback, useEffect, useState,
} from 'react';
import classNames from 'classnames';

export function AbstractCaroussel<I extends string | { id:string | number }>(
  {
    children,
    className,
    items,
    intervalMs,
  }: {
    items: Array<I>,
    className?:string,
    intervalMs?: number,
    children: (cur:I) => ReactNode
  },
) {
  const [curIndex, setCurIndex] = useState(0);
  const nextPrevClasses = classNames(
    'inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-accent/30 group-hover:bg-secondary/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white',
    'dark:bg-gray-800/30 dark:group-hover:bg-secondary/60 dark:group-focus:ring-secondary/70 sm:h-10 sm:w-10',
  );
  const nextItem = useCallback(() => {
    setCurIndex((old) => {
      const next = old - 1;
      return next < 0 ? items.length - 1 : next;
    });
  }, [items.length]);

  const prevItem = useCallback(() => {
    setCurIndex((old) => {
      const next = old + 1;
      return next >= items.length ? 0 : next;
    });
  }, [items.length]);

  useEffect(() => {
    const interval = intervalMs === undefined || intervalMs <= 0 ? undefined : setInterval(nextItem, intervalMs);
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [intervalMs, curIndex, nextItem]);

  return (
    <div className={classNames('relative max-h-[90vh] overflow-hidden', className)}>
      {items.map((cur, idx) => {
        const key = typeof cur === 'string' ? cur : cur.id;
        return (
          <div
            key={key}
            className={classNames(
              'motion-reduce:transition-none transition-all duration-1000 delay-300 ease-in-out',
              'absolute top-1/2 left-1/2 block w-full -translate-x-1/2 -translate-y-1/2',
              { hidden: curIndex !== idx },
            )}
          >
            {children(cur)}
          </div>
        );
      }) }

      <button
        onClick={nextItem}
        type="button"
        className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className={nextPrevClasses}>
          <svg aria-hidden="true" className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        onClick={prevItem}
        type="button"
        className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className={nextPrevClasses}>
          <svg aria-hidden="true" className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}
