import classNames from 'classnames';
import {
  CSSProperties, MouseEventHandler, TouchEventHandler, useCallback, useMemo, useState,
} from 'react';
import { Image, useImagePadding } from '../utils/Image';
import { Styleable } from '../types/Styleable';
import { MetadataMap } from '../static/readImage';

export function BeforeAfterImage({
  className,
  style,
  data,
}: { data: MetadataMap } & Partial<Styleable>) {
  const [after, afterInfo] = useMemo(() => {
    const key = Object.keys(data)[0];
    return [key, data[key]] as const;
  }, [data]);
  const [before, beforeInfo] = useMemo(() => {
    const key = Object.keys(data)[0];
    const beforeKey = `${key}o`;
    return [beforeKey, data[beforeKey] ?? data[key]] as const;
  }, [data]);

  const paddingTop = useImagePadding(afterInfo.size);
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
      className={classNames('relative cursor-grab overflow-hidden left-1/2 -translate-x-1/2', className)}
    >
      <div className="absolute inset-0 block w-full overflow-hidden">
        <div className={classNames(className, 'w-full h-full')}>
          <Image alt={afterInfo.metadata.title} className={classNames(className, 'overflow-visible')} filename={after} />
        </div>
      </div>
      <div className="absolute inset-0 z-10 block overflow-hidden" style={{ width: `${widthPercentage}%` }}>
        <div style={{ width: beforeWidth }} className={classNames('h-full', className)}>
          <Image alt={beforeInfo.metadata.title} className={className} filename={before} />
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
