import type { GradeThreshold } from "@/models/GradeThreshold";
import type { Student } from "@/models/Student";
import type { Test } from "@/models/Test";

export function isTestData(obj: any): obj is Omit<Test, 'id'> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.maxScore === 'number' &&
    typeof obj.weight === 'number'
  );
}

export function isStudentData(obj: any): obj is Omit<Student, 'id'> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.surname === 'string'
  );
}

export function isGradeThreshold(obj: any): obj is Omit<GradeThreshold, 'id'> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.minPercentage === 'number'
  );
}