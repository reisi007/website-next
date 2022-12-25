import { DeepPartial, FormState, SubmitHandler } from 'react-hook-form';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { useCallback } from 'react';
import { Form } from '../images-next/form/Form';
import { Input, Textarea } from '../images-next/form/Input';
import { Styleable } from '../images-next/types/Styleable';
import { ActionButton } from '../images-next/button/ActionButton';

type ReviewFormContentType = {
  firstName: string
  lastName: string
  email: string
  tel: string
  rating: number
  public: string
  private: string
};

export function ReviewForm({
  className,
  style,
  ...initialValue
}: DeepPartial<ReviewFormContentType> & Partial<Styleable>) {
  const onSubmit: SubmitHandler<ReviewFormContentType> = useCallback(() => {
  }, []);
  return (
    <div className={className} style={style}>
      <h3>Kontaktiere mich</h3>
      <Form<ReviewFormContentType> initialValue={initialValue} onSubmit={onSubmit}>
        {(formState, register) => <ReviewFormContent formState={formState} register={register} />}
      </Form>
    </div>
  );
}

function ReviewFormContent({
  formState,
  register,
}: { formState: FormState<ReviewFormContentType>, register: UseFormRegister<ReviewFormContentType> }) {
  const {
    errors,
  } = formState;
  return (
    <div className="grid md:grid-cols-2">
      <Input label="Vorname" errorMessage={errors.firstName} required className="mr-1" {...register('firstName')} />
      <Input label="Nachname" errorMessage={errors.lastName} required className="ml-1" {...register('lastName')} />
      <Input label="E-Mail" errorMessage={errors.email} required {...register('email')} type="email" className="col-span-2" />
      <Input label="Handynummer" errorMessage={errors.tel} {...register('tel')} type="tel" className="col-span-2" />
      <Textarea rows={5} label="Deine öffentliche Bewertung" required errorMessage={errors.public} {...register('public')} type="tel" className="col-span-2" />
      <Textarea rows={5} label="Deine Nachricht an mich" errorMessage={errors.private} {...register('private')} type="tel" className="col-span-2" />
      <ActionButton className="col-span-2 mt-4 bg-primary text-onPrimary">Absenden</ActionButton>
    </div>
  );
}
