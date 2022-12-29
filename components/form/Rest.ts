import { sendPost } from '../images-next/host/Rest';
import { CommonFormFields } from '../images-next/form/Url2Form';

export async function submitReview(data: Review) {
  return sendPost('api/reviews_post.php', data);
}

export type Review = CommonFormFields & {
  rating: number
  review_public: string
  review_private: string
};
