import React from 'react';
import classNames from 'classnames';
import { Styleable } from '../types/Styleable';

export enum ReisishotIcons {
  Facebook = 'rs-facebook',
  Instagram = 'rs-instagram',
  Whatsapp = 'rs-whatsapp',
  Messenger = 'rs-messenger',
  Mail = 'rs-mail',
  Podcast = 'rs-podcast',
  Star_empty = 'rs-star-empty',
  Star_full = 'rs-star-full',
  Star_half = 'rs-star-half',
}

export enum ReisishotIconSizes {
  X_SMALL = 'rs-xs',
  SMALL = 'rs-sm',
  NORMAL = '',
  LARGE = 'rs-lg',
  XLARGE = 'rs-2xl',
  XXLARGE = 'rs-3xl',
  XXXLARGE = 'rs-4xl',
}

export function ReisishotIcon({
  children,
  icon,
  size = ReisishotIconSizes.NORMAL,
  className,
  style,
}: { children?: JSX.Element, icon: ReisishotIcons, size?: ReisishotIconSizes } & Partial<Styleable>) {
  const classes = classNames(`icon ${icon} ${size}`, className);
  return <i style={style} className={classes}>{children}</i>;
}
