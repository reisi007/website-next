import React from 'react';
import classNames from 'classnames';
import { Styleable } from '../types/Styleable';

export enum ReisishotIcons {
  Facebook = 'rs-facebook',
  Instagram = 'rs-instagram',
  Whatsapp = 'rs-whatsapp',
  Messenger = 'rs-messenger',
  Menu = 'rs-menu',
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
  ...props
}: { icon: ReisishotIcons, size?: ReisishotIconSizes } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Partial<Styleable>) {
  const classes = classNames(`icon ${icon} ${size}`, className);
  return <i {...props} className={classes}>{children}</i>;
}
