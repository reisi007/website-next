import { RefObject, useEffect } from 'react';

export function useIntersection<Html extends HTMLElement>(ref: RefObject<Html>, callback: IntersectionObserverCallback, rootMargin:string = '-300px 0px 300px 0px') {
  useEffect(() => {
    const { current } = ref;
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
  }, [callback, ref, rootMargin]);
}
