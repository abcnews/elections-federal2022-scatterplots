export function chunk<T>(arr: T[], chunkSize = 1) {
  const cache: T[][] = [];
  const tmp = [...arr];
  while (tmp.length) {
    cache.push(tmp.splice(0, chunkSize));
  }
  return cache;
}
