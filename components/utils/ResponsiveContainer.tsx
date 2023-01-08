import {
  CSSProperties, MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';

type Props = { children: (width: number) => JSX.Element | Array<JSX.Element>, className?: string, style?: CSSProperties };

export function ResponsiveContainer({
  children,
  className,
  style,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const width = useWidth(divRef);
  return (
    <div className={className} style={style} ref={divRef}>
      {width !== undefined && children(width)}
    </div>
  );
}

function useWidth(divRef: MutableRefObject<HTMLDivElement | null>): number | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);

  const testWidth = useCallback(() => {
    if (divRef.current) {
      setWidth(divRef.current?.offsetWidth);
    }
  }, [divRef]);

  useLayoutEffect(testWidth, [testWidth]);

  useEffect(() => {
    const listener = testWidth;
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  });

  return width;
}
