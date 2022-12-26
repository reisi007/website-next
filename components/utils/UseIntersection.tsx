import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';

export function useIntersection<Html extends HTMLElement>(callback: IntersectionObserverCallback, rootMargin:string = '-300px 0px 300px 0px'): Dispatch<SetStateAction<Html | null>> {
  const [current, setRef] = useState<Html | null>(null);
  useEffect(() => {
    if (current === null) {
      return () => {
      };
    }
    const observer = new IntersectionObserver(
      callback,
      { rootMargin },
    );
    observer.observe(current);
    return () => observer.unobserve(current);
  }, [callback, current, rootMargin]);

  return setRef;
}
