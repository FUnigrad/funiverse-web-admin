import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Major } from 'src/@types';

interface EntitySearchParams {
  entity: string;
  field: string | string[];
  operator?: string | string[];
  value: any;
}
export const searchApis = {
  search: (params: EntitySearchParams) => {
    const field = Array.isArray(params.field)
      ? params.field[params.field.length - 1]
      : params.field;

    const defaultOperator = Array.isArray(params.field)
      ? Array(params.field.length).fill('like')
      : 'like';

    return axiosClient.get('/search', {
      params: { operator: defaultOperator, ...params },
      transformResponse: [
        function (data) {
          const parsedData = JSON.parse(data);

          return parsedData.map((d) => ({ label: d[field], value: d.id }));
        },
      ],
    });
  },
};
