import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Major } from 'src/@types';

interface EntitySearchParams {
  entity: string;
  field: string;
  operator?: string;
  value: any;
}
export const searchApis = {
  search: (params: EntitySearchParams) =>
    axiosClient.get('/search', {
      params: { operator: 'like', ...params },
      transformResponse: [
        function (data) {
          const parsedData = JSON.parse(data);
          return parsedData.map((d) => ({ label: d[params.field], value: d.id }));
        },
      ],
    }),
};
