import React, { ReactNode } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import {
  Form, FormChildrenProps, PHONE_REGEXP, Shape,
} from '../images-next/form/Form';
import {
  CheckboxInput, FiveStarInput, Input, Textarea,
} from '../images-next/form/Input';
import { Styleable } from '../images-next/types/Styleable';
import { SubmitButton } from '../images-next/button/ActionButton';
import { ReisishotIconSizes } from '../images-next/utils/ReisishotIcons';
import { Review, useSubmitReview } from './Rest';

const reviewResolver = yupResolver(yup.object<Partial<Shape<Review>>>(
  {
    firstName: yup.string()
      .required('Bitte Vorname eingeben'),
    lastName: yup.string()
      .required('Bitte Nachname eingeben'),
    email: yup.string()
      .email('Bitte gib eine gültige E-Mail Adresse ein')
      .required('Bitte Email eingeben'),
    tel: yup.string()
      .matches(PHONE_REGEXP, 'Bitte eine gültige Telefonnummer eingeben'),
    rating: yup.number()
      .required('Bitte gib deine CBewertung in halben Sternen ein'),
    review_public: yup.string()
      .required('Bitte gib deine Bewertung in Textform ab'),
    dsgvo: yup.boolean()
      .required('Bitte stimme der Veröffentlichung der Bewertung zu')
      .isTrue('Bitte stimme der Veröffentlichung der Bewertung zu'),
    review_private: yup.string(),
  },
)
  .required());

export function ReviewForm({
  children,
  className,
  style,
}: Partial<Styleable> & { children: (setValue:UseFormSetValue<Review>) => ReactNode }) {
  const action = useSubmitReview();
  return (
    <div className={className} style={style}>
      <Form<Review> onSubmit={action} resolver={reviewResolver}>
        {(formState, control, setValue, reset) => (
          <>
            {children(setValue) }
            <ReviewFormContent formState={formState} control={control} setValue={setValue} reset={reset} />
          </>
        )}
      </Form>
    </div>
  );
}

function ReviewFormContent({
  formState,
  control,
}: FormChildrenProps<Review>) {
  const {
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isSubmitSuccessful,
  } = formState;

  return (
    <>
      {!isSubmitSuccessful && (
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Input label="Vorname" control={control} errorMessage={errors.firstName} required className="md:mr-1" name="firstName" />
        <Input label="Nachname" control={control} errorMessage={errors.lastName} required className="md:ml-1" name="lastName" />
        <Input label="E-Mail" control={control} errorMessage={errors.email} required name="email" type="email" className="md:col-span-2" />
        <Input label="Handynummer" control={control} errorMessage={errors.tel} name="tel" type="tel" className="md:col-span-2" />
        <FiveStarInput label="Deine Bewertung in halben Sternen" control={control} required name="rating" starSize={ReisishotIconSizes.XXLARGE} />
        <Textarea rows={5} control={control} label="Deine öffentliche Bewertung" required errorMessage={errors.review_public} name="review_public" type="tel" className="md:col-span-2" />
        <Textarea rows={5} control={control} label="Deine Nachricht an mich" errorMessage={errors.review_private} name="review_private" type="tel" className="md:col-span-2" />
        <CheckboxInput<Review>
          name="dsgvo"
          label="Ich bin damit einverstanden, dass mein Review veröffentlicht wird. (Falls freizügigere Bilder erstellt wurden, wird nur der erste Buchstabe des Nachnamens verwendet)"
          control={control}
          errorMessage={errors.dsgvo}
          required
          className="mt-2 md:col-span-2"
        />
        <SubmitButton isSubmitting={isSubmitting} errors={errors} disabled={!isValid || !isDirty || isSubmitting} className="mt-4 bg-primary text-onPrimary md:col-span-2">Absenden</SubmitButton>
      </div>
      )}
      {isSubmitSuccessful && <h2 className="mt-4">Das Formular wurde erfolgreich gesendet. Danke für deine Bewertung!</h2>}
    </>
  );
}
