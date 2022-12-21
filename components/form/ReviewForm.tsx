import { DeepPartial, FormState, SubmitHandler } from 'react-hook-form';
import { UseFormRegister } from 'react-hook-form/dist/types/form';
import { Form } from '../images-next/form/Form';
import { Input } from '../images-next/form/Input';

type ReviewFormContentType = {
  name: string
  email: string
  rating: number
  public: string
  private: string
};

export function ReviewForm({
  onSubmit,
  ...initialValue
}: DeepPartial<ReviewFormContentType> & { onSubmit: SubmitHandler<ReviewFormContentType> }) {
  return (
    <Form<ReviewFormContentType> initialValue={initialValue} onSubmit={onSubmit}>
      {(formState, register) => <ReviewFormContent formState={formState} register={register} />}
    </Form>
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
    <Input errorMessage={errors.name} {...register('name')} className="w-full md:w-1/2" />
  );
}
