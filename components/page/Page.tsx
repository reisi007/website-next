import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { CONTAIINER_CLASSES } from '../utils/Css';

export function Page({
  children,
  className,
  title,
}: { children: ReactNode, title: string, className?: string }) {
  return (
    <>
      <Header title={title} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
