import { subjectData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Combo, ComboDetail } from 'src/@types';

export const dataApis = {
  getTemplate: (params: { entity: string }) =>
    axiosClient.get<Blob>(`/import`, { params, responseType: 'blob' }),
};
