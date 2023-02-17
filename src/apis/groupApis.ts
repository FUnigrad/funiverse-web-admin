import { groupData } from 'src/__mock__';
import axiosClient from './axiosClient';
import { fakePromise } from 'src/utils';
const searchData = [
  {
    value: 1,
    label: 'ABC',
  },
  {
    value: 2,
    label: 'DEF',
  },
  {
    value: 3,
    label: 'ACE',
  },
];
const fakeSearchPromise = (inputValue: string): Promise<any[]> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      return res(searchData.filter((s) => s.label.includes(inputValue)));
    }, 300);
  });

export const groupApis = {
  // fetchGroups: () => axiosClient.get('/group'),
  getGroups: () => fakePromise(groupData),
  getFakedSearch: fakeSearchPromise,
};
