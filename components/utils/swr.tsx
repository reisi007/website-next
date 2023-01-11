import { useEffect } from 'react';
import useSWR from 'swr';
import { ROOT_URL } from '../images-next/host/Rest';
import { JSON_FETCHER } from '../swr/Fetcher';
import { LoginResponse } from '../admin/AdminLoginForm';
import { useAdminLogout } from '../admin/AdminLogoutContext';

export function useAuthedGet<Response>(path:string, user:string, hash:string) {
  const url = `${ROOT_URL}api/${path}`;
  return useSWR<Response, Error, [string, string, string]>(
    [url, user, hash],
    JSON_FETCHER,
  );
}

export function useAdminGet<Response>(path:string, loginResponse:LoginResponse) {
  const url = `${ROOT_URL}api/${path}`;

  const { error, ...rest } = useSWR<Response, Error, [string, string, string]>(
    [url, loginResponse.user, loginResponse.hash],
    JSON_FETCHER,
  );

  const adminLogout = useAdminLogout();

  useEffect(() => {
    if (error && error.name === '401') adminLogout();
  }, [adminLogout, error]);

  return { error, ...rest };
}
