import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export function Page({
  children,
  className,
  title,
}: { children: ReactNode, title: string, className?: string }) {
  return (
    <>
      <Header title={title} />
      <main className={classNames('mx-auto w-full sm:w-[540px] md:w-[720px] lg:w-[960px] xl:w-[1140px] xxl:w-[1320px]', className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}
