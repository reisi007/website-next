import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Header, HeaderProps } from './Header';
import { Footer } from './Footer';
import { CONTAIINER_CLASSES } from '../utils/Css';

export function Page({
  children,
  className,
  ...headerProps
}: { children: ReactNode, className?: string } & HeaderProps) {
  return (
    <>
      <Header {...headerProps} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
