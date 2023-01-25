import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useCallback } from 'react';
import { ExtSubmitHandler, Form, Shape } from '../images-next/form/Form';
import { ServerError, useManualFetchString } from '../images-next/host/Rest';
import { Input } from '../images-next/form/Input';
import { SubmitButton } from '../images-next/button/ActionButton';

export type SetLoginResponse = (d: string | null) => void;

export function AdminLoginForm({ setLoginData }: { setLoginData: SetLoginResponse }) {
  const submit = useLogin(setLoginData);
  return (
    <Form<AdminLoginData> className="p" onSubmit={submit} resolver={loginFormResolver}>
      {({
        isSubmitting,
        isSubmitSuccessful,
        errors,
      }, control) => (
        <>
          {!isSubmitSuccessful && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Input label="Benutzername" control={control} errorMessage={errors.user} required className="md:col-span-2" name="user" />
              <Input type="password" label="Passwort" control={control} errorMessage={errors.pwd} required className="md:col-span-2" name="pwd" />
              <SubmitButton isSubmitting={isSubmitting} errors={errors} className="md:col-span-2">Login</SubmitButton>
            </div>
          )}
        </>
      )}
    </Form>
  );
}

export type AdminLoginData = { user: string, pwd: string } & ServerError;
export type LoginResponse = { user: string, hash: string } & ServerError;
export type LoginRequestHeaders = { Email: string, Accesskey: string };
export type JwtRequestHeaders = { Authorization: `Bearer: ${string}` };

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

export function useLogin(setLoginData: (d: (string | null)) => void): ExtSubmitHandler<AdminLoginData> {
  const manualFetch = useManualFetchString<AdminLoginData, LoginRequestHeaders>('api/admin_login_post.php', 'post');
  return useCallback((setErrors, clearErrors, {
    user,
    pwd,
  }) => manualFetch(setErrors, clearErrors, {
    Email: user,
    Accesskey: pwd,
  })
    .then(
      (r) => setLoginData(r),
      (_) => setLoginData(null),
    ), [manualFetch, setLoginData]);
}

type JwtServer = { jwt: string, server?: string };

export function useLoginWithJwt(setLoginData: (d: (string | null)) => void): ExtSubmitHandler<JwtServer> {
  const manualFetch = useManualFetchString<JwtServer, JwtRequestHeaders>('api/admin_login_post.php', 'post');
  return useCallback((setErrors, clearErrors, { jwt }, _event, signal) => manualFetch(setErrors, clearErrors, { Authorization: `Bearer: ${jwt}` }, undefined, signal)
    .then((r) => setLoginData(r)), [manualFetch, setLoginData]);
}
