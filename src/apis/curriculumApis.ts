import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Curriculum } from 'src/@types';
import { curriculumData } from 'src/__mock__';

export const curriculumApis = {
  // getCurriculums: () => axiosClient.get('/curriculum'),
  getCurriculums: () => fakePromise(curriculumData),
  getCurriculum: (id: string) => axiosClient.get<Curriculum>(`/curriculum/${id}`),
};
