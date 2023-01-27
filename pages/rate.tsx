import { PortfolioPage } from '../components/PortfolioPage';
import { ReviewForm } from '../components/form/ReviewForm';
import { usePrefilledValue } from '../components/images-next/form/Url2Form';

export default function SubmitReview() {
  return (
    <PortfolioPage title="Bewerte mich" showContactForm={false}>
      <ReviewForm className="p" prefilled={usePrefilledValue()} />
    </PortfolioPage>
  );
}
