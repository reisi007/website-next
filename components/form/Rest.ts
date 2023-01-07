import { useCallback } from 'react';
import { useManualFetch } from '../images-next/host/Rest';
import { CommonFormFields, RequiredFormFields } from '../images-next/form/Url2Form';
import { ExtSubmitHandler } from '../images-next/form/Form';

export function useSubmitReview() : ExtSubmitHandler<Review> {
  const postReview = useManualFetch<Review>('api/reviews_post.php');
  return useCallback((setErrors, clearErrors, data) => postReview(setErrors, clearErrors, undefined, data), [postReview]);
}

export type Review = CommonFormFields & RequiredFormFields & {
  rating: number
  review_public: string
  review_private: string
};
