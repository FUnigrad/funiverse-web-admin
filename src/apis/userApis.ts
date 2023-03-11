import { userData } from 'src/__mock__';
import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { User } from 'src/@types';
export const userApis = {
  getUsers: () => axiosClient.get<User[]>('/user'),
  updateUser: (newUser) => axiosClient.put('/user', newUser),
  createUser: (newUser) => axiosClient.post('/user', newUser),
  deleteUser: (id) => axiosClient.delete(`/user/${id}`),
  getCurriculumUsersNone: () => axiosClient.get(`user/curriculum/none`),
};
