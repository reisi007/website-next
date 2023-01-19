import { useMemo } from 'react';

export function useParsedJwt(jwt: string): Jwt {
  return useMemo(() => parseJwt(jwt), [jwt]);
}

export type Jwt = {
  iss: string,
  aud: string,
  iat: number,
  nbf: number,
  exp: number
};

function parseJwt(token: string): Jwt {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+')
    .replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window.atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0)
        .toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}
