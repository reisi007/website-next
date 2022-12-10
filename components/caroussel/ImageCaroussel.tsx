import classNames from 'classnames';
import { AbstractCaroussel } from './AbstractCaroussel';
import { Image } from '../utils/Image';

export function ImageCaroussel({
  className,
  items,
  intervalMs = 7500,

}: { items: Array<string>, className?: string, intervalMs?: number }) {
  const classes = classNames(className, 'h-128 rounded-lg');
  return (
    <AbstractCaroussel intervalMs={intervalMs} className={classes} items={items}>
      {(cur) => <Image className={classes} filename={cur} />}
    </AbstractCaroussel>
  );
}
