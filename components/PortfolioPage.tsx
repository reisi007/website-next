import Head from 'next/head';
import React, {
  ReactNode, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import { FloatingActionButton } from './images-next/button/FloatingActionButton';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from './images-next/utils/ReisishotIcons';
import { Header, HeaderProps } from './Header';
import { CONTAIINER_CLASSES } from './images-next/utils/Css';
import { Footer } from './images-next/page/Footer';
import { ReviewForm } from './form/ReviewForm';

export type BasePageProps = { children: ReactNode, className?: string } & HeaderProps;

export function PortfolioPage({
  children,
  className,
  ...headerProps
}: BasePageProps) {
  const [isFabVisible, setFabVisible] = useState(true);
  const ref = React.useRef<HTMLElement>(null);

  const curDiv = ref.current;
  useEffect(() => {
    if (curDiv === null) {
      return () => {
      };
    }
    const observer = new IntersectionObserver(
      (e) => setFabVisible(!e[0].isIntersecting),
      { rootMargin: '0px 0px 0px 0px' },
    );
    observer.observe(curDiv);
    return () => observer.unobserve(curDiv);
  }, [curDiv]);

  const footerChildren:ReactNode = (<ReviewForm className={classNames(CONTAIINER_CLASSES, 'pt-6')} />);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <Header {...headerProps} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <Footer innerRef={ref}>{footerChildren}</Footer>
      {isFabVisible && (
      <FloatingActionButton className="group bg-primary-accent/80 text-onPrimary-accent hover:bg-primary-accent">
        <ReisishotIcon size={ReisishotIconSizes.LARGE} className="!text-onPrimary group-hover:mr-2" icon={ReisishotIcons.Mail} />
        <span className="hidden duration-500 ease-in-out group-hover:inline-block">Kontaktiere mich</span>
      </FloatingActionButton>
      )}
    </>
  );
}
