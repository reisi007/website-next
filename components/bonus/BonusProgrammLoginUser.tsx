import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ExtSubmitHandler, Form, Shape } from '../images-next/form/Form';
import { Input } from '../images-next/form/Input';
import { SubmitButton } from '../images-next/button/ActionButton';
import { ServerError } from '../images-next/host/Rest';

type BonusProgrammLoginType = { id: string, pin:string } & ServerError;

export function BonusProgrammLoginUser() {
  const router = useRouter();
  const { query } = router;
  return (
    <BonusProgramLoginBase onSubmit={useCallback((_setErrors, _clearErrors, {
      id,
      pin,
    }) => {
      router.replace({
        query: {
          ...query,
          id,
          pin,
        },
      });
    }, [query, router])}
    />
  );
}

function BonusProgramLoginBase({ onSubmit }:{ onSubmit: ExtSubmitHandler<BonusProgrammLoginType> }) {
  return (
    <>
      <h2>Anmelden</h2>
      <div className="flex justify-center">
        <Form<BonusProgrammLoginType> onSubmit={onSubmit} className="md:w-1/2" resolver={bonusProgrammFormResolver}>
          {({
            isSubmitting,
            errors,
          }, control) => (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Input label="ID" control={control} errorMessage={errors.id} required name="id" />
              <Input label="Pin" type="password" control={control} errorMessage={errors.pin} required name="pin" />
              <SubmitButton isSubmitting={isSubmitting} errors={errors} className="md:col-span-2">Login</SubmitButton>
            </div>
          )}
        </Form>
      </div>
    </>
  );
}

const bonusProgrammFormResolver = yupResolver(yup.object<Partial<Shape<BonusProgrammLoginType>>>(
  {
    id: yup.string().min(1).required(),
    pin: yup.string().required(),
  },
)
  .required());
