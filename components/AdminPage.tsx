import { ReactNode, useCallback } from 'react';
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

export function AdminPage({
  children,
  title,
}: { children: ReactNode, title: string }) {
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
  return <AdminPageContent title={title} setLoginData={setLoginData}>{children}</AdminPageContent>;
}

function AdminPageContent({
  title,
  children,
  setLoginData,
}: { title: string, children: ReactNode, setLoginData: SetLoginResponse }) {
  const clearLogin = useCallback(() => setLoginData(null), [setLoginData]);
  return (
    <AdminLogoutContext value={clearLogin}>
      <BasePage menuItems={PATHS} showContactForm={false} title={`Admin - ${title}`}>
        {children}
      </BasePage>
    </AdminLogoutContext>
  );
}
