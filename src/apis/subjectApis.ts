import { subjectData } from 'src/__mock__';
import { fakePromise } from 'src/utils';

export const subjectApis = {
  getSubjects: () => fakePromise(subjectData),
};
