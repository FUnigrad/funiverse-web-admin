import { fakePromise } from 'src/utils';
import axiosClient from './axiosClient';
import { Curriculum, CurriculumSyllabus } from 'src/@types';
import { curriculumData } from 'src/__mock__';

export const curriculumApis = {
  getCurriculums: () => axiosClient.get('/curriculum'),
  // getCurriculums: () => fakePromise(curriculumData),
  getCurriculum: (id) => axiosClient.get<Curriculum>(`/curriculum/${id}`),
  updateCurriculum: (newCurriculum) => axiosClient.put('/curriculum', newCurriculum),
  createCurriculum: (newCurriculum) => axiosClient.post('/curriculum', newCurriculum),
  deleteCurriculum: (id) => axiosClient.delete(`/curriculum/${id}`),
  getCurriculumSyllabuses: (id) =>
    axiosClient.get<CurriculumSyllabus[]>(`/curriculum/${id}/syllabus`),
  updateCurriculumSyllabus: (currId, newCurriculumSyllabus) =>
    axiosClient.put(`/curriculum/${currId}/syllabus`, newCurriculumSyllabus),
  createCurriculumSyllabus: (currId, newCurriculumSyllabus) =>
    axiosClient.post(`/curriculum/${currId}/syllabus`, newCurriculumSyllabus),
  deleteCurriculumSyllabus: (currId, curriculumSyllabusId) =>
    axiosClient.delete(`/curriculum/${currId}/syllabus/${curriculumSyllabusId}`),
  getCurriculumUsers: (id) => axiosClient.get(`/curriculum/${id}/students`),
};
