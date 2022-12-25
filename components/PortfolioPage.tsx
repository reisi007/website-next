import Head from 'next/head';
import React, { ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { FloatingActionButton } from './images-next/button/FloatingActionButton';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from './images-next/utils/ReisishotIcons';
import { Header, HeaderProps } from './Header';
import { CONTAIINER_CLASSES } from './images-next/utils/Css';
import { FooterContent } from './images-next/page/FooterContent';
import { ReviewForm } from './form/ReviewForm';
import { useIntersection } from './utils/UseIntersection';

export type BasePageProps = { children: ReactNode, className?: string } & HeaderProps;

export function PortfolioPage({
  children,
  className,
  ...headerProps
}: BasePageProps) {
  const [isFabVisible, setFabVisible] = useState(true);
  const ref = React.useRef<HTMLElement>(null);
  useIntersection(
    ref,
    useCallback((e) => setFabVisible(!e[0].isIntersecting), [setFabVisible]),
    '0px 0px 0px 0px',
  );
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Header {...headerProps} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <footer ref={ref}>
        <ReviewForm className={classNames(CONTAIINER_CLASSES, 'pt-6')} />
        <FooterContent />
      </footer>
      {isFabVisible && (
        <FloatingActionButton className="group bg-primary-accent/80 text-onPrimary-accent hover:bg-primary-accent">
          <ReisishotIcon size={ReisishotIconSizes.LARGE} className="!text-onPrimary group-hover:mr-2" icon={ReisishotIcons.Mail} />
          <span className="hidden duration-500 ease-in-out group-hover:inline-block">Kontaktiere mich</span>
        </FloatingActionButton>
      )}
    </>
  );
}
