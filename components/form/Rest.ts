import React from 'react';
import { sendPost } from '../images-next/host/Rest';

export async function submitReview(data: Review, event?: React.BaseSyntheticEvent): Promise<boolean> {
  event?.preventDefault();
  return sendPost('api/reviews_post.php', data);
}

export type Review = {
  firstName: string
  lastName: string
  email: string
  tel: string
  rating: number
  review_public: string
  review_private: string
};
