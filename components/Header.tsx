import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from './images-next/utils/ReisishotIcons';
import styles from './images-next/utils/Utils.module.css';

type PathEntry = { title: string, important?: boolean };
const PATHS: { [key: string]: PathEntry } = {
  '': {
    title: 'Startseite',
    important: true,
  },
  vision: {
    title: 'Dein Leben - Deine Bilder',
    important: true,
  },
  edit: { title: 'Alles - Außer langweilige Bilder' },
  reviews: { title: 'Alle Bewertungen' },
};

function NavMenu({ pageTitle }: { pageTitle: string }) {
  const curPath = useRouter().asPath.substring(1);
  const allMenuLinks = useMemo(() => Object.entries(PATHS)
    .filter(([p]) => p !== curPath), [curPath]);

  const importantLinks = useMemo(() => allMenuLinks.filter(([_, v]) => v.important === true), [allMenuLinks]);
  const restLinks = useMemo(() => allMenuLinks.filter(([_, v]) => v.important !== true), [allMenuLinks]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const onClick = useCallback(() => setMenuVisible((c) => !c), []);
  const classes = 'grid grid-cols-1 md:grid-cols-2';

  return (
    <nav className={classNames('mb-4 bg-primary p-4 text-onPrimary', styles.container)}>
      <div className="flex w-full">
        <div className="w-full font-logo">
          <h1 className="w-full pb-2 text-center">{pageTitle}</h1>
          <ul className={classNames('pb-1', classes, { 'mb-2': isMenuVisible })}>
            {importantLinks.map(renderMenuLink)}
          </ul>
          {restLinks.length > 0 && isMenuVisible && (
          <ul className={classNames(classes, 'mt-2 border-t-2 border-onPrimary pt-2')}>
            {restLinks.map(renderMenuLink)}
          </ul>
          )}
        </div>
        {restLinks.length > 0 && <ReisishotIcon className="mt-4" onClick={onClick} size={ReisishotIconSizes.LARGE} icon={ReisishotIcons.Menu} />}
      </div>
    </nav>
  );
}

function renderMenuLink(props: [string, PathEntry]) {
  const [url, { title }] = props;
  return (
    <li className="inline-block list-none text-center" key={url}>
      <Link className="black text-center text-lg hover:text-xl" href={`/${url}`}>{title}</Link>
    </li>
  );
}

export type HeaderProps = { title: string, description?:string, keywords?: Array<string> };

export function Header({ title, description, keywords }: HeaderProps) {
  const keywordString = keywords?.join(',');
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        {keywordString !== undefined && keywordString.length > 0 && <meta name="keywords" content={keywordString} />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      </Head>
      <NavMenu pageTitle={title} />
    </>
  );
}
