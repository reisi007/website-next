// https://gist.github.com/Yopadd/d1381e0fdc1aa6bedaeb36b7a8381892
async function asyncFlatMap<T, O>(arr: T[], asyncFn: (t: T) => Promise<O[]>): Promise<O[]> {
  return Promise.all(flatten(await asyncMap(arr, asyncFn)));
}

function flatMap<T, O>(arr: T[], fn: (t: T) => O[]): O[] {
  return flatten(arr.map(fn));
}

function asyncMap<T, O>(arr: T[], asyncFn: (t: T) => Promise<O>): Promise<O[]> {
  return Promise.all(arr.map(asyncFn));
}

function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr);
}

export {
  asyncFlatMap,
  asyncMap,
  flatMap,
  flatten,
};
