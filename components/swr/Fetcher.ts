export const JSON_AUTHED_FETCHER = (args: [RequestInfo | URL, string, string]) => {
  const [input, user, hash] = args;

  const init: RequestInit = {
    headers: {
      Email: user,
      Accesskey: hash,
    },
  };
  return handleResponse(fetch(input, init));
};

export const JSON_FETCHER = (args: [RequestInfo | URL]) => {
  const [input] = args;

  return handleResponse(fetch(input));
};

export const JSON_JWT_FETCHER = (args: [RequestInfo | URL, string]) => {
  const [input, jwt] = args;

  const init: RequestInit = {
    headers: {
      Authorization: `Bearer: ${jwt}`,
    },
  };
  return handleResponse(fetch(input, init));
};

async function handleResponse(response: Promise<Response>): Promise<any> {
  return response.then(async (r) => {
    if (r.ok) {
      const text = await r.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        const is401 = text === 'Not logged in...';
        const error = new Error(text);
        error.name = is401 ? '401' : '500';
        return Promise.reject(error);
      }
    }
    const error = new Error(await r.text());
    error.name = r.status.toString(10);
    return Promise.reject(error);
  });
}
