import ExportedImage from 'next-image-export-optimizer';
import {
  CSSProperties,
  MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';

export function Image({ className, filename }:{ filename: string, className?:string }) {
  return (
    <div className={classNames(className, 'relative')}>
      <ExportedImage
        className={classNames('object-contain')}
        fill
        src={`/images/${filename}.jpg`}
        alt="TODO"
      />
    </div>
  );
}

type Props = { children: (width: number, height:number) => JSX.Element | Array<JSX.Element>, className?: string, style?: CSSProperties };
export function ResponsiveContainer({
  children,
  className,
  style,
}: Props) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(divRef);
  return (
    <div className={className} style={style} ref={divRef}>
      {size !== undefined && children(size[0], size[1])}
    </div>
  );
}

export function useSize(divRef: MutableRefObject<HTMLDivElement | null>): [number, number] | undefined {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const testWidth = useCallback(() => {
    if (divRef.current) {
      setWidth(divRef.current?.offsetWidth);
    }
  }, [divRef]);

  const testHeight = useCallback(() => {
    if (divRef.current) {
      setHeight(divRef.current?.offsetHeight);
    }
  }, [divRef]);

  useLayoutEffect(testWidth, [testWidth]);
  useLayoutEffect(testHeight, [testHeight]);

  useEffect(() => {
    const listener = testWidth;
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  });
  if (width === undefined || height === undefined) return undefined;

  return [width, height];
}
