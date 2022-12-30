export const JSON_FETCHER = (args: [RequestInfo | URL, RequestInit | undefined]) => {
  const [input, init] = args;
  return fetch(input, init)
    .then((r) => r.json());
};
