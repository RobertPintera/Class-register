import type { Grade } from "@/models/Grade";
import type { GradeThreshold } from "@/models/GradeThreshold";
import type { Test } from "@/models/Test";

export function getStudentFinalGrade(grades: Grade[], tests: Test[],thresholds: GradeThreshold[], studentId: string): string {
  const studentGrades = grades.filter(g => g.studentId === studentId);

  const results = studentGrades.map(g => {
    const test = tests.find(t => t.id === g.testId);
    if (!test) throw new Error(`Test ${g.testId} not found`);
    return { ...test, points: g.points };
  });

  // checking for missing mandatory tests
  // const missedMandatory = tests.some(
  //   t => t.isMandatory && !results.find(r => r.id === t.id)
  // );

  // checking for failed mandatory tests
  // const failedMandatory = results.some(
  //   r => r.isMandatory && r.requiredPoints !== null && r.points < r.requiredPoints
  // );

  // if (missedMandatory || failedMandatory) {
  //   const lowestGrade = thresholds.sort((a, b) => a.minPercentage - b.minPercentage)[0];
  //   return lowestGrade ? lowestGrade.name : '—';
  // }

  const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
  const weightedSum = results.reduce(
    (sum, r) => sum + (r.points / r.maxPoints) * 100 * r.weight,
    0
  );
  const averagePercentage = weightedSum / totalWeight;

  const grade = thresholds
    .filter(t => averagePercentage >= t.minPercentage)
    .sort((a, b) => b.minPercentage - a.minPercentage)[0];

  return grade ? grade.name : '—';
}
