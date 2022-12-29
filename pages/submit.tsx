import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import { PortfolioPage } from '../components/PortfolioPage';
import { ReviewForm } from '../components/form/ReviewForm';
import { Review } from '../components/form/Rest';
import { useSetValue } from '../components/images-next/form/Url2Form';

export default function SubmitReview() {
  return (
    <PortfolioPage title="Bewerte mich" showContactForm={false}>
      <ReviewForm>
        {(setValue) => (
          <PrefillFromUrl setValue={setValue} />
        )}
      </ReviewForm>
    </PortfolioPage>
  );
}

function PrefillFromUrl({ setValue }: { setValue: UseFormSetValue<Review> }): JSX.Element | null {
  useSetValue('lastName', setValue);
  useSetValue('email', setValue);
  useSetValue('firstName', setValue);
  useSetValue('tel', setValue);
  return null;
}
