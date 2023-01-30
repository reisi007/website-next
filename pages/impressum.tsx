import Markdown from '../components/images-next/impressum.mdx';
import { WebPage } from '../components/WebPage';

export default function Impressum() {
  return (
    <WebPage className="mt-4" title="Impressum">
      <Markdown />
    </WebPage>
  );
}
