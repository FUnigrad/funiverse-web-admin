export interface Major {
  id: number;
  code: string;
  name: string;
  active: boolean;
}
export interface Specialization {
  id: number;
  code: string;
  name: string;
  major: Major;
  active: boolean;
}
export interface Curriculum {
  id: number;
  name: string;
  code: string;
  schoolYear: string;
  description: string;
  major: Major;
  specialization: Specialization;
  startedTerm: {
    season: string;
    year: string;
  };
  noSemester: number;
  currentSemester: number;
  active: boolean;
}

export interface CurriculumSyllabus {
  syllabus: {
    id: number;
    name: string;
    code: null;
  };
  semester: number;
}
export interface CurriculumUser {
  id: number;
  code: string;
  name: string;
}
