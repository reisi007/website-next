export const JSON_FETCHER = (args: [RequestInfo | URL, string, string]) => {
  const [input, user, hash] = args;

  const init : RequestInit = {
    headers: {
      Email: user,
      AccessKey: hash,
    },
  };
  return fetch(input, init)
    .then(async (r) => {
      if (r.ok) return r.json();
      const error = new Error(await r.text());
      error.name = r.status.toString(10);
      return Promise.reject(error);
    });
};
