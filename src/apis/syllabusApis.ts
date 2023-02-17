import { syllabusData } from 'src/__mock__';
import { fakePromise } from 'src/utils';

export const syllabusApis = {
  getSyllabuses: () => fakePromise(syllabusData),
};
