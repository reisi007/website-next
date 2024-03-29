import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DisplayReviews } from '../components/review/DisplayReviews';
import { getAllReviews } from '../components/images-next/static/loadReviews';
import { Testimonial } from '../components/images-next/types/TestimonialTypes';
import { WebPage } from '../components/WebPage';

export default function ReviewPage({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <WebPage
      title="Reviews"
      keywords={['Bewertung', 'Review', 'Fotoshooting', 'Bewertungen', 'Fotograf']}
      description={`Lies dir ${reviews.length} Bewertungen von Kunden durch.
      Ich kann dir vieles erzählen, glaube aber das, was Personen wirklich erlebt haben.`}
    >
      <DisplayReviews reviews={reviews} />
    </WebPage>
  );
}

export const getStaticProps: GetStaticProps<{ reviews: Array<Testimonial> }> = async () => ({
  props: { reviews: await getAllReviews() },
});
