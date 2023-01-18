import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { CookieConsentContext } from '../components/images-next/cookies/Cookies';
import { ConsentBanner } from '../components/images-next/cookies/ConsentBanner';
import { Matomo } from '../components/images-next/cookies/Matomo';

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <CookieConsentContext>
      <Matomo siteId="1" />
      <ConsentBanner />
      <Component {...pageProps} />
    </CookieConsentContext>
  );
}
