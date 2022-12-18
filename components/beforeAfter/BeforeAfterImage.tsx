import classNames from 'classnames';
import {
  CSSProperties, MouseEventHandler, TouchEventHandler, useCallback, useState,
} from 'react';
import { ImageSize } from 'ts-exif-parser';
import {
  Breakpoint, Image, ImageBreakpoints, useImagePadding,
} from '../utils/Image';
import { Styleable } from '../types/Styleable';
import { ImageInfo } from '../static/readImage';

export function BeforeAfterImage({
  className,
  style,
  data,
  name,
  breakpoints,
  size,
}: { data: ImageInfo, name: string, size: ImageSize, breakpoints: ImageBreakpoints } & Partial<Styleable>) {
  const paddingTop = useImagePadding(data.size);
  const [widthPercentage, setWidthPercentage] = useState(50);
  const beforeWidth = `${(100 / widthPercentage) * 100}%`;

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setWidthPercentage((x * 100) / e.currentTarget.offsetWidth);
  }, []);

  const onTouch: TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    setWidthPercentage((x * 100) / e.currentTarget.offsetWidth);
  }, []);

  const myStyle: CSSProperties = style ?? { paddingTop };
  return (
    <div
      style={myStyle}
      onClick={onClick}
      onMouseMove={onClick}
      onTouchMove={onTouch}
      className={classNames('group relative cursor-grab overflow-hidden left-1/2 -translate-x-1/2', className)}
    >
      <div className="absolute inset-0 block w-full overflow-hidden">
        <div className={classNames(className, 'w-full h-full')}>
          <Image alt={data.metadata.title} size={size} breakpoints={breakpoints} className={classNames(className, 'overflow-visible')} filename={name} />
        </div>
      </div>
      <div className="absolute inset-0 z-10 block overflow-hidden" style={{ width: `${widthPercentage}%` }}>
        <div style={{ width: beforeWidth }} className={classNames('h-full', className)}>
          <Image alt={`Original von ${data.metadata.title}`} size={size} breakpoints={breakpoints} className={className} filename={`${name}o`} />
        </div>
      </div>
      <div
        className={classNames(
          'before:block before:fixed before:-top-1/2 before:inset-y-0 before:w-0.5 before:bg-white before:h-[100rem] before:ml-4',
          'z-20 absolute top-1/2 text-center align-middle -ml-9 -mt-10 h-10 w-10 pointer-events-none text-white rounded-full',
          'shadow bg-transparent border-2',
        )}
        style={{ left: `calc(${widthPercentage}% + 1rem)` }}
      >
        <span
          className="mt-[-0.1875rem] inline-flex h-10 items-center text-lg tracking-[0.25rem]"
        >
          ◂▸
        </span>
      </div>
    </div>
  );
}

const BEFORE_AFTER_BREAKPOINTS: ImageBreakpoints = {
  [Breakpoint.default]: 1,
  [Breakpoint.sm]: 1,
  [Breakpoint.md]: 1,
  [Breakpoint.lg]: 2,
  [Breakpoint.xl]: 3,
  [Breakpoint['2xl']]: 3,
};

export function MultipleBeforeAfterImages<T extends string>({ data }: { data: Record<T, ImageInfo> }) {
  const entries :Array<[string, ImageInfo]> = Object.entries(data);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {entries
        .sort(([_, a], [,b]) => -((a.metadata.created ?? -1) - (b.metadata.created ?? -1))) // Sort from newest to oldest
        .map(([name, info]) => <BeforeAfterImage className="h-full" size={info.size} key={name} name={name} breakpoints={BEFORE_AFTER_BREAKPOINTS} data={info} />)}
    </div>
  );
}
