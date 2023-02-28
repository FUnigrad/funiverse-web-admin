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
  startedTerm: null;
  noSemester: number;
  currentSemester: number;
  active: boolean;
}
