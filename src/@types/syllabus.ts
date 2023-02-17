import { Subject } from "./subject";

export interface Syllabus {
  id:               number;
  name:             null | string;
  subject:          Subject | null;
  noCredit:         number;
  noSlot:           number;
  duration:         number | null;
  preRequisite:     Syllabus[] | null;
  description:      null | string;
  minAvgMarkToPass: number;
  active:           boolean;
}
