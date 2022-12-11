import classNames from 'classnames';
import {
  MouseEventHandler, TouchEventHandler, useCallback, useMemo, useState,
} from 'react';
import { Image } from './Image';

export function BeforeAfterImage({
  before,
  className,
  after,
}: { before: string, after: string, className?: string }) {
  const [width, setWidth] = useState(70);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setWidth((x * 100) / e.currentTarget.offsetWidth);
  }, []);
  const onTouch: TouchEventHandler<HTMLDivElement> = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.changedTouches[0].clientX - rect.left;
    setWidth((x * 100) / e.currentTarget.offsetWidth);
  }, []);

  const afterImage = useMemo(() => <Image className={classNames(className, 'overflow-visible')} filename={after} />, [after, className]);
  const beforeImage = useMemo(() => <Image className={className} filename={before} />, [before, className]);

  return (
    <div
      onClick={onClick}
      onMouseMove={onClick}
      onTouchMove={onTouch}
      className={classNames('relative cursor-grab overflow-hidden left-1/2 -translate-x-1/2', className)}
    >
      <div className="absolute inset-0 block w-full overflow-hidden">
        <div className={classNames(className, 'w-full h-full')}>
          {afterImage}
        </div>
      </div>
      <div className="absolute inset-0 z-10 block overflow-hidden" style={{ width: `${width}%` }}>
        <div className={classNames('absolute inset-0', className)}>
          {beforeImage}
        </div>
      </div>
      <div className={classNames('z-20 absolute top-1/2 text-center align-middle -ml-8 -mt-8 h-8 w-8 pointer-events-none bg-white rounded-full')} style={{ left: `calc(${width}% + 1rem)` }}>
        {'< >'}
      </div>
    </div>
  );
}
