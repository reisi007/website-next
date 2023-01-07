import { ReactNode, useMemo } from 'react';
import Head from 'next/head';
import { AdminLoginForm, LoginResponse, SetLoginResponse } from './admin/AdminLoginForm';
import { BasePage } from './images-next/page/BasePage';
import { PathEntry } from './images-next/page/NavMenu';
import { useLocalStorage } from './images-next/utils/LocalStorage';

const PATHS: { [key: string]: PathEntry } = {
  admin: {
    title: 'Startseite',
    important: true,
  },
};

type ChildrenWithLogout = (logout: () => void) => ReactNode;

export function AdminPage({
  children,
  title,
}: { children: ChildrenWithLogout, title: string }) {
  const [loginData, setLoginData] = useLocalStorage<LoginResponse>('admin_login');

  if (loginData === null) {
    return (
      <BasePage title="Admin Login" showContactForm={false}>
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
  children: childrenCreator,
  setLoginData,
}: { title: string, children: ChildrenWithLogout, setLoginData: SetLoginResponse }) {
  const children = useMemo(() => childrenCreator(() => setLoginData(null)), [childrenCreator, setLoginData]);
  return (
    <BasePage menuItems={PATHS} showContactForm={false} title={`Admin - ${title}`}>
      {children}
    </BasePage>
  );
}
