import { Curriculum } from "./curriculum";

export interface User {
  id:           number;
  name:         string;
  code:         string;
  role:         string;
  schoolYear:   string;
  personalMail: string;
  eduMail:      string;
  avatar:       string;
  phoneNumber:  string;
  curriculum:   Curriculum;
  active:       boolean;
}