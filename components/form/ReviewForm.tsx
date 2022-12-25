import { DeepPartial, Resolver } from 'react-hook-form';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormChildrenProps } from '../images-next/form/Form';
import { FiveStarInput, Input, Textarea } from '../images-next/form/Input';
import { Styleable } from '../images-next/types/Styleable';
import { ActionButton } from '../images-next/button/ActionButton';
import { ReisishotIconSizes } from '../images-next/utils/ReisishotIcons';
import { submitToEmail } from '../images-next/form/Form2Email';

type ReviewFormContentType = {
  firstName: string
  lastName: string
  email: string
  tel: string
  rating: number
  public: string
  private: string
  subject:string
};

const PHONE_REGEXP = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const registerSchema: Resolver<ReviewFormContentType> = yupResolver(yup.object(
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
    public: yup.string()
      .required('Bitte gib deine Bewertung in Textform ab'),
  },
)
  .required());

export function ReviewForm({
  className,
  style,
  ...initialValue
}: DeepPartial<ReviewFormContentType> & Partial<Styleable>) {
  return (
    <div className={className} style={style}>
      <Form<ReviewFormContentType> initialValue={initialValue} onSubmit={submitToEmail} resolver={registerSchema}>
        {(formState, register, control, setValue) => <ReviewFormContent formState={formState} register={register} control={control} setValue={setValue} />}
      </Form>
    </div>
  );
}

function ReviewFormContent({
  formState,
  register,
  control,
  setValue,
}: FormChildrenProps<ReviewFormContentType>) {
  const {
    errors,
    isValid,
    isDirty,
    isSubmitting,
    isSubmitSuccessful,
  } = formState;

  useEffect(() => {
    setValue('subject', 'Neue Bewertung');
  }, [setValue]);

  return (
    <>
      {!isSubmitSuccessful && (
        <>
          <h3>Kontaktiere mich</h3>
          <div className="grid md:grid-cols-2">
            <Input label="Vorname" control={control} errorMessage={errors.firstName} required className="mr-1" {...register('firstName', { required: true })} />
            <Input label="Nachname" control={control} errorMessage={errors.lastName} required className="ml-1" {...register('lastName')} />
            <Input label="E-Mail" control={control} errorMessage={errors.email} required {...register('email')} type="email" className="col-span-2" />
            <Input label="Handynummer" control={control} errorMessage={errors.tel} {...register('tel')} type="tel" className="col-span-2" />
            <FiveStarInput label="Deine Bewertung in halben Sternen" control={control} required name={register('rating').name} starSize={ReisishotIconSizes.XXLARGE} />
            <Textarea rows={5} control={control} label="Deine öffentliche Bewertung" required errorMessage={errors.public} {...register('public')} type="tel" className="col-span-2" />
            <Textarea rows={5} control={control} label="Deine Nachricht an mich" errorMessage={errors.private} {...register('private')} type="tel" className="col-span-2" />
            <ActionButton type="submit" disabled={!isValid || !isDirty || isSubmitting} className="col-span-2 mt-4 bg-primary text-onPrimary">Absenden</ActionButton>
          </div>
        </>
      )}
      {isSubmitSuccessful && <h2>Das Formular wurde erfolgreich gesendet. Danke für deine Bewertung!</h2>}
    </>
  );
}
