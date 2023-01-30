import { WebPage } from '../components/WebPage';
import { ReviewForm } from '../components/form/ReviewForm';
import { usePrefilledValue } from '../components/images-next/form/Url2Form';

export default function SubmitReview() {
  return (
    <WebPage title="Bewerte mich" showContactForm={false}>
      <ReviewForm className="p" prefilled={usePrefilledValue()} />
    </WebPage>
  );
}
