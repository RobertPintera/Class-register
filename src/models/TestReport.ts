import type { PerformanceStats } from "./PerformanceStats";
import type { Test } from "./Test";
import type { PassRate } from "./PassRate";
import type { StudentResult } from "./StudentResult";

export interface TestReport {
  test: Test;
  performance: PerformanceStats;
  malePerformance: PerformanceStats;
  femalePerformace: PerformanceStats;
  passRate: PassRate;
  results: StudentResult[];
}