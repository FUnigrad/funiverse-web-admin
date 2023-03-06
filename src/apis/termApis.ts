import { Term } from 'src/@types';
import axiosClient from './axiosClient';
export const termApis = {
  getTerms: () => axiosClient.get<Term[]>(`/term`),
  getTerm: (id: string) => axiosClient.get<Term>(`/term/${id}`),
  startNewSemester: () => axiosClient.post(`/term/next`),
  createTerm: (newTerm) => axiosClient.post('/term', newTerm),
  updateTerm: (newTerm) => axiosClient.put(`/term/${newTerm.id}`, newTerm),
  deleteTerm: (id: number) => axiosClient.delete(`/term/${id}`),
};
