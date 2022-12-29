import { Resolver } from 'react-hook-form';
import React, { ReactNode } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import { Form, FormChildrenProps, PHONE_REGEXP } from '../images-next/form/Form';
import { FiveStarInput, Input, Textarea } from '../images-next/form/Input';
import { Styleable } from '../images-next/types/Styleable';
import { ActionButton } from '../images-next/button/ActionButton';
import { ReisishotIconSizes } from '../images-next/utils/ReisishotIcons';
import { Review, submitReview } from './Rest';

const reviewResolver: Resolver<Review> = yupResolver(yup.object(
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
      .required('Bitte gib deine Bewertung in halben Sternen ein'),
    review_public: yup.string()
      .required('Bitte gib deine Bewertung in Textform ab'),
  },
)
  .required());

export function ReviewForm({
  children,
  className,
  style,
}: Partial<Styleable> & { children: (setValue:UseFormSetValue<Review>) => ReactNode }) {
  return (
    <div className={className} style={style}>
      <Form<Review> onSubmit={submitReview} resolver={reviewResolver}>
        {(formState, register, control, setValue) => (
          <>
            {children(setValue) }
            <ReviewFormContent formState={formState} register={register} control={control} setValue={setValue} />
          </>
        )}
      </Form>
    </div>
  );
}

function ReviewFormContent({
  formState,
  register,
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
        <Input label="Vorname" control={control} errorMessage={errors.firstName} required className="md:mr-1" {...register('firstName')} />
        <Input label="Nachname" control={control} errorMessage={errors.lastName} required className="md:ml-1" {...register('lastName')} />
        <Input label="E-Mail" control={control} errorMessage={errors.email} required {...register('email')} type="email" className="md:col-span-2" />
        <Input label="Handynummer" control={control} errorMessage={errors.tel} {...register('tel')} type="tel" className="md:col-span-2" />
        <FiveStarInput label="Deine Bewertung in halben Sternen" control={control} required name={register('rating').name} starSize={ReisishotIconSizes.XXLARGE} />
        <Textarea rows={5} control={control} label="Deine öffentliche Bewertung" required errorMessage={errors.review_public} {...register('review_public')} type="tel" className="md:col-span-2" />
        <Textarea rows={5} control={control} label="Deine Nachricht an mich" errorMessage={errors.review_private} {...register('review_private')} type="tel" className="md:col-span-2" />
        <ActionButton type="submit" disabled={!isValid || !isDirty || isSubmitting} className="mt-4 bg-primary text-onPrimary md:col-span-2">Absenden</ActionButton>
      </div>
      )}
      {isSubmitSuccessful && <h2 className="mt-4">Das Formular wurde erfolgreich gesendet. Danke für deine Bewertung!</h2>}
    </>
  );
}
