import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Major } from 'src/@types';

export const majorApis = {
  getMajors: () => axiosClient.get<Major[]>('/major'),
  updateMajor: (newMajor) => axiosClient.put('/major', newMajor),
  createMajor: (newMajor) => axiosClient.post('/major', newMajor),
  deleteMajor: (id) => axiosClient.delete(`/major/${id}`),
  getMajor: (id: string) => axiosClient.get<Major>(`/major/${id}`),
};
