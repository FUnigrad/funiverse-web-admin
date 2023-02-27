import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Major } from 'src/@types';

export const majorApis = {
  getMajors: () => axiosClient.get<Major[]>('/major'),
  getMajor: (id: string) => axiosClient.get<Major>(`/major/${id}`),
};
