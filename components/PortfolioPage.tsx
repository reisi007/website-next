import Head from 'next/head';
import { BasePage, BasePageProps } from './images-next/page/BasePage';
import { FloatingActionButton } from './images-next/button/FloatingActionButton';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from './images-next/utils/ReisishotIcons';

export function PortfolioPage({ children, ...props }: BasePageProps) {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <BasePage {...props}>{children}</BasePage>
      <FloatingActionButton className="group bg-primary-accent/80 text-onPrimary-accent hover:bg-primary-accent">
        <ReisishotIcon size={ReisishotIconSizes.LARGE} className="!text-onPrimary group-hover:mr-2" icon={ReisishotIcons.Mail} />
        <span className="hidden duration-500 ease-in-out group-hover:inline-block">Kontaktiere mich</span>
      </FloatingActionButton>
    </>
  );
}
