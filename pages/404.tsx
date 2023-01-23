import { PortfolioPage } from '../components/PortfolioPage';
import { Content404 } from '../components/images-next/404';

export default function ErrorPage() {
  return (
    <PortfolioPage title="404: Seite nicht gefunden">
      <Content404 />
    </PortfolioPage>
  );
}
