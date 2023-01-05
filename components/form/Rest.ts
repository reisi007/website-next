import { useManualFetch } from '../images-next/host/Rest';
import { CommonFormFields, RequiredFormFields } from '../images-next/form/Url2Form';

export function useSubmitReview() {
  return useManualFetch('api/reviews_post.php');
}

export type Review = CommonFormFields & RequiredFormFields & {
  rating: number
  review_public: string
  review_private: string
};
