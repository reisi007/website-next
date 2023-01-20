import { ReactNode, useCallback, useMemo } from 'react';
import Head from 'next/head';
import dayjs from 'dayjs';
import { AdminLoginForm, SetLoginResponse, useLoginWithJwt } from './admin/AdminLoginForm';
import { BasePage } from './images-next/page/BasePage';
import { PathEntry } from './images-next/page/NavMenu';
import { useLocalStorageString } from './images-next/utils/LocalStorage';
import { AdminLogoutContext } from './admin/AdminLogoutContext';
import { useParsedJwt } from './admin/Jwt';
import { useCancelableEffect } from './images-next/utils/CustomEffects';

const PATHS: { [key: string]: PathEntry } = {
  admin: {
    title: 'Startseite',
    important: true,
  },
  'admin/reviews': {
    title: 'Testimonials',
    important: true,
  },
  'admin/contract': {
    title: 'Vertrag erstellen',
    important: true,
  },
};

type LoginResponseChildren = (ld: string) => ReactNode;

export function AdminPage({
  children,
  title,
}: { children: LoginResponseChildren, title: string }) {
  const [jwt, setLoginData] = useLocalStorageString('admin_login');

  if (jwt === null) {
    return (
      <BasePage title="Admin - Login" showContactForm={false}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <AdminLoginForm setLoginData={setLoginData} />
      </BasePage>
    );
  }
  return <AdminPageContent jwt={jwt} title={title} setLoginData={setLoginData}>{(e) => children(e)}</AdminPageContent>;
}

function AdminPageContent({
  title,
  children: rawChildren,
  jwt,
  setLoginData,
}: { title: string, children: LoginResponseChildren, jwt: string, setLoginData: SetLoginResponse }) {
  const clearLogin = useCallback(() => setLoginData(null), [setLoginData]);
  const children = useMemo(() => rawChildren(jwt), [jwt, rawChildren]);
  const parsedJwt = useParsedJwt(jwt);
  const refetchJwt = useLoginWithJwt(setLoginData);

  useCancelableEffect((signal) => {
    const futureExp = dayjs()
      .add(7, 'days')
      .toDate()
      .getTime();
    const jwtExp = parsedJwt.exp;

    const shouldRenew = futureExp <= jwtExp;
    if (shouldRenew) {
      refetchJwt(
        (_, error) => console.error('Error re-fetching JWT', error),
        () => {
        },
        { jwt },
        undefined,
        signal,
      );
    }
  }, [parsedJwt.exp, jwt, refetchJwt]);

  return (
    <AdminLogoutContext value={clearLogin}>
      <BasePage menuItems={PATHS} showContactForm={false} title={`Admin - ${title}`}>
        {children}
      </BasePage>
    </AdminLogoutContext>
  );
}
