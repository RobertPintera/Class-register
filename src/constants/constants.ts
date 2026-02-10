import type { Settings } from "@/models/Settings";

export const defaultSettings: Settings = {
  id: 'global', 
  editWithDialog: true, 
  frozenStudentInGrades: true, 
  lowestGradeForTestMandatory: false, 
  lowestGradeForTestFailed: false
};

export const GENDER = {
  MALE: "Male",
  FEMALE: "Female"
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];