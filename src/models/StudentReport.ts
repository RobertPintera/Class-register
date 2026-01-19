import type { GradeStats } from "./GradeStats";
import type { GradeThreshold } from "./GradeThreshold";
import type { PerformanceStats } from "./PerformanceStats";
import type { TestResult } from "./TestResult";
import type { Student } from "./Student";
import type { DetailedPassRate } from "./DetailedPassRate";

export interface StudentReport {
  student: Student;
  finalGrade: GradeThreshold;
  gradesStats: GradeStats;
  individualPerformance: PerformanceStats;
  classPerformace: PerformanceStats;
  passRate: DetailedPassRate;
  results: TestResult[];
}