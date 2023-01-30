import { WebPage } from '../components/WebPage';
import { Content404 } from '../components/images-next/404';

export default function ErrorPage() {
  return (
    <WebPage title="404: Seite nicht gefunden">
      <Content404 />
    </WebPage>
  );
}
