import type { Grade } from "@/models/Grade";
import type { Test } from "@/models/Test";

// Functions for tests

export function getTestAverage(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.score !== undefined)
    .map(g => g.score);

  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getTestMedian(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId)
    .map(g => g.score)
    .sort((a, b) => a - b);

  if (!scores.length) return 0;

  const mid = Math.floor(scores.length / 2);
  return scores.length % 2 !== 0
    ? scores[mid]
    : (scores[mid - 1] + scores[mid]) / 2;
}

export function getTestStandardDeviation(grades: Grade[], testId: string) {
  const scores = grades
    .filter(g => g.testId === testId)
    .map(g => g.score);

  if (!scores.length) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;

  return Math.sqrt(variance);
}

// Functions for students

export function getStudentWeightedAverage(grades: Grade[], tests: Test[], studentId: string) : number {
  const studentGrades = grades.filter(g => g.studentId === studentId);

  if (!studentGrades.length) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const g of studentGrades) {
    const test = tests.find(t => t.id === g.testId);
    if (test && test.weight > 0) {
      weightedSum += (g.score / test.maxScore) * test.weight;
      totalWeight += test.weight;
    }
  }

  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
}

export function getStudentMedian(grades: Grade[], tests: Test[], studentId: string): number{
  const scores = grades
      .filter(g => g.studentId === studentId)
      .map(g => {
        const test = tests.find(t => t.id === g.testId);
        return test && test.maxScore > 0 ? (g.score / test.maxScore) * 100 : 0;
      })
      .sort((a, b) => a - b);

  if (!scores.length) return 0;

  const mid = Math.floor(scores.length / 2);
  return scores.length % 2 !== 0
    ? scores[mid]
    : (scores[mid - 1] + scores[mid]) / 2;
}

export function getStudentStandardDeviation(grades: Grade[], tests: Test[], studentId: string): number {
  const scores = grades
    .filter(g => g.studentId === studentId)
    .map(g => {
      const test = tests.find(t => t.id === g.testId);
      return test && test.maxScore > 0 ? (g.score / test.maxScore) * 100 : 0;
    });

  if (!scores.length) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;

  return Math.sqrt(variance);
}
