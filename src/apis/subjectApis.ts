import { subjectData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Subject } from 'src/@types';

export const subjectApis = {
  getSubjects: () => axiosClient.get<Subject[]>('/subject'),
  updateSubject: (newSubject) => axiosClient.put('/subject', newSubject),
  createSubject: (newSubject) => axiosClient.post('/subject', newSubject),
  deleteSubject: (id) => axiosClient.delete(`/subject/${id}`),
};
