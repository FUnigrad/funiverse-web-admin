import { userData } from 'src/__mock__';
import { fakePromise } from 'src/utils';

export const userApis = {
  getUsers: () => fakePromise(userData),
};
