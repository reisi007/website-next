import { PathEntry } from './images-next/page/NavMenu';
import { BasePage, BasePageProps } from './images-next/page/BasePage';
import { HeaderProps } from './images-next/page/Header';

const PATHS: { [key: string]: PathEntry } = {
  '': {
    title: 'Startseite',
    important: true,
  },
  vision: {
    title: 'Dein Leben - Deine Bilder',
    important: true,
  },
  edit: { title: 'Alles - Außer langweilige Fotos' },
  reviews: { title: 'Alle Bewertungen' },
};

export function PortfolioPage({ children, ...props }: BasePageProps & Omit<HeaderProps, 'menuItems'>) {
  return (
    <BasePage menuItems={PATHS} {...props}>{children}</BasePage>
  );
}
