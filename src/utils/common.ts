function pluralize(noun: string): string {
  // const exceptions = {
  //   syllabus: 'syllabi',
  // };

  // if (exceptions[noun.toLowerCase()]) {
  //   return exceptions[noun.toLowerCase()];
  // }

  const lastLetter = noun[noun.length - 1];

  if (lastLetter === 'y') {
    return noun.slice(0, -1) + 'ies';
  }

  if (['s', 'x', 'z'].includes(lastLetter) || noun.slice(-2) === 'ch' || noun.slice(-2) === 'sh') {
    return noun + 'es';
  }

  return noun + 's';
}
const fakePromise = <TData>(data: TData): Promise<TData> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      return res(data);
    }, 1000);
  });
export { pluralize, fakePromise };
