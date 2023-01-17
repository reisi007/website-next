import Markdown from '../components/images-next/impressum.mdx';
import { PortfolioPage } from '../components/PortfolioPage';

export default function Impressum() {
  return (
    <PortfolioPage className="mt-4" title="Impressum">
      <Markdown />
    </PortfolioPage>
  );
}
