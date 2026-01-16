import type { GradeStats } from "./GradeStats";
import type { GradeThreshold } from "./GradeThreshold";
import type { Performance } from "./Performance";
import type { StudentResult } from "./TestResult";
import type { Student } from "./Student";

export interface StudentReport {
  student: Student;
  finalGrade: GradeThreshold;
  gradesStats: GradeStats;
  individualPerformance: Performance;
  classPerformace: Performance;
  results: StudentResult[];
}