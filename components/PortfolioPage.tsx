import React, {
  ReactNode, useCallback, useState,
} from 'react';
import classNames from 'classnames';
import { FloatingActionButton } from './images-next/button/FloatingActionButton';
import { ReisishotIcon, ReisishotIcons, ReisishotIconSizes } from './images-next/utils/ReisishotIcons';
import { Header, HeaderProps } from './Header';
import { CONTAIINER_CLASSES } from './images-next/utils/Css';
import { FooterContent } from './images-next/page/FooterContent';
import { useIntersection } from './images-next/utils/UseIntersection';
import { useModal } from './images-next/utils/Modal';
import { ContactForm } from './images-next/form/ContactForm';

export type BasePageProps = { children: ReactNode, className?: string } & HeaderProps;

enum FabVisibility {
  VISIBLE,
  TEMPORARILY_DISABLED,
  PERMANENTLY_DISABLED,

}
export function PortfolioPage({
  children,
  className,
  ...headerProps
}: BasePageProps) {
  const [isFabVisible, setFabVisible] = useState(FabVisibility.VISIBLE);

  const ref = useIntersection(
    useCallback((e) => setFabVisible((old) => {
      if (old === FabVisibility.PERMANENTLY_DISABLED) return FabVisibility.PERMANENTLY_DISABLED;
      return e[0].isIntersecting ? FabVisibility.TEMPORARILY_DISABLED : FabVisibility.VISIBLE;
    }), [setFabVisible]),
    '0px 0px 0px 0px',
  );
  const [dialog, setDialogVisible] = useModal('Kontaktere mich', () => <ContactForm />);
  const openDialogAction = useCallback(() => {
    setDialogVisible(true);
    setFabVisible(FabVisibility.PERMANENTLY_DISABLED);
  }, [setDialogVisible]);

  return (
    <>
      <Header {...headerProps} />
      <main className={classNames(CONTAIINER_CLASSES, className)}>
        {children}
      </main>
      <footer className="mt-4 mb-2" ref={ref}>
        <h2>Kontaktere mich</h2>
        <ContactForm className={classNames(CONTAIINER_CLASSES, 'pt-6')} />
        <FooterContent />
      </footer>
      {dialog}
      {isFabVisible === FabVisibility.VISIBLE && (
        <FloatingActionButton onClick={openDialogAction} className="group bg-primary-accent/80 text-onPrimary-accent hover:bg-primary-accent">
          <ReisishotIcon size={ReisishotIconSizes.LARGE} className="!text-onPrimary group-hover:mr-2" icon={ReisishotIcons.Mail} />
          <span className="hidden duration-500 ease-in-out group-hover:inline-block">Kontaktiere mich</span>
        </FloatingActionButton>
      )}
    </>
  );
}
