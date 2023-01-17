import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { init, push } from '@socialgouv/matomo-next';

import { useEffect } from 'react';
import { CookieConsentContext } from '../components/images-next/cookies/Cookies';
import { ConsentBanner } from '../components/images-next/cookies/ConsentBanner';

const MATOMO_URL = 'https://analytics.reisinger.pictures/';
const MATOMO_SITE_ID = '1';

export default function App({
  Component,
  pageProps,
}: AppProps) {
  useEffect(() => {
    init({
      url: MATOMO_URL,
      siteId: MATOMO_SITE_ID,
    });
    push(['requireCookieConsent']);
  }, []);
  return (
    <CookieConsentContext>
      <ConsentBanner />
      <Component {...pageProps} />
    </CookieConsentContext>
  );
}
