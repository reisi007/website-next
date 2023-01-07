import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useCallback } from 'react';
import { ExtSubmitHandler, Form, Shape } from '../images-next/form/Form';
import { ServerError, useManualFetch } from '../images-next/host/Rest';
import { Input } from '../images-next/form/Input';
import { SubmitButton } from '../images-next/button/ActionButton';

export function AdminLoginForm() {
  const submit = useLogin();
  return (
    <Form<AdminLoginData> className="p" onSubmit={submit} resolver={loginFormResolver}>
      {({
        isSubmitting,
        isSubmitSuccessful,
        errors,
      }, register, control) => (
        <>
          {!isSubmitSuccessful && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Input label="Benutzername" control={control} errorMessage={errors.user} required className="md:col-span-2" {...register('user')} />
              <Input type="password" label="Passwort" control={control} errorMessage={errors.pwd} required className="md:col-span-2" {...register('pwd')} />
              <SubmitButton isSubmitting={isSubmitting} errors={errors} className="md:col-span-2">Login</SubmitButton>
            </div>
          )}
        </>
      )}
    </Form>
  );
}

export type AdminLoginData = { user: string, pwd: string } & ServerError;
type LoginResponse = { user: string, hash: string } & ServerError;
type LoginRequestHeaders = { Email: string, Accesskey: string };

const loginFormResolver = yupResolver(yup.object<Partial<Shape<AdminLoginData>>>(
  {
    user: yup.string()
      .min(1)
      .required(),
    pwd: yup.string()
      .min(1)
      .required(),
  },
)
  .required());

export function useLogin(): ExtSubmitHandler<AdminLoginData> {
  const manualFetch = useManualFetch<AdminLoginData, LoginResponse, LoginRequestHeaders>('api/admin_login_post.php', 'post');
  return useCallback((setErrors, clearErrors, {
    user,
    pwd,
  }) => manualFetch(setErrors, clearErrors, {
    Email: user,
    Accesskey: pwd,
  }), [manualFetch]);
}
