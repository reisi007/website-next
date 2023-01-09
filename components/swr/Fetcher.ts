export const JSON_FETCHER = (args: [RequestInfo | URL, RequestInit | undefined]) => {
  const [input, init] = args;
  return fetch(input, init)
    .then((r) => {
      if (r.ok) return r.json();
      return Promise.reject(r);
    });
};
