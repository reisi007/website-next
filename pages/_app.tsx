import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { init } from '@socialgouv/matomo-next';
import { useEffect } from 'react';

const MATOMO_URL = 'https://analytics.reisinger.pictures/';
const MATOMO_SITE_ID = '1';

export default function App({
  Component,
  pageProps,
}: AppProps) {
  useEffect(() => {
    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
  }, []);
  return <Component {...pageProps} />;
}
