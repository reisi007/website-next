import { ReactNode, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { AdminLoginForm, LoginResponse, SetLoginResponse } from './admin/AdminLoginForm';
import { BasePage } from './images-next/page/BasePage';
import { PathEntry } from './images-next/page/NavMenu';
import { useLocalStorage } from './images-next/utils/LocalStorage';
import { AdminLogoutContext } from './admin/AdminLogoutContext';

const PATHS: { [key: string]: PathEntry } = {
  admin: {
    title: 'Startseite',
    important: true,
  },
};

type LoginResponseChildren = (ld: LoginResponse) => ReactNode;

export function AdminPage({
  children,
  title,
}: { children: LoginResponseChildren, title: string }) {
  const [loginData, setLoginData] = useLocalStorage<LoginResponse>('admin_login');

  if (loginData === null) {
    return (
      <BasePage title="Admin - Login" showContactForm={false}>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <AdminLoginForm setLoginData={setLoginData} />
      </BasePage>
    );
  }
  return <AdminPageContent loginData={loginData} title={title} setLoginData={setLoginData}>{(e) => children(e)}</AdminPageContent>;
}

function AdminPageContent({
  title,
  children: rawChildren,
  loginData,
  setLoginData,
}: { title: string, children: LoginResponseChildren, loginData: LoginResponse, setLoginData: SetLoginResponse }) {
  const clearLogin = useCallback(() => setLoginData(null), [setLoginData]);
  const children = useMemo(() => rawChildren(loginData), [loginData, rawChildren]);
  return (
    <AdminLogoutContext value={clearLogin}>
      <BasePage menuItems={PATHS} showContactForm={false} title={`Admin - ${title}`}>
        {children}
      </BasePage>
    </AdminLogoutContext>
  );
}
