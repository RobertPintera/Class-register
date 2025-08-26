import type { Grade } from "@/models/Grade";
import type { Student } from "@/models/Student";
import type { Test } from "@/models/Test";

// Global

export function round2(num: number) {
  return Math.round(num * 100) / 100;
}

// Functions for tests

export function getTestAverage(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .map(g => g.points);

  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getTestMedian(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId)
    .map(g => g.points)
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
    .map(g => g.points);

  if (!scores.length) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;

  return Math.sqrt(variance);
}

export function getTestMin(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .map(g => g.points);

  if (!scores.length) return 0;
  return Math.min(...scores);
}

export function getTestMax(grades: Grade[], testId: string): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .map(g => g.points);

  if (!scores.length) return 0;
  return Math.max(...scores);
}

export function getTestAverageByGender(
  grades: Grade[],
  students: Student[],
  testId: string,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points);

  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getTestNormalizedAverageByGender(
  grades: Grade[],
  students: Student[],
  test: Test,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === test.id && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points);

  if (!scores.length) return 0;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  return (avg / test.maxPoints) * 100;
}


export function getTestMedianByGender(
  grades: Grade[],
  students: Student[],
  testId: string,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points)
    .sort((a, b) => a - b);

  if (!scores.length) return 0;

  const mid = Math.floor(scores.length / 2);
  return scores.length % 2 !== 0
    ? scores[mid]
    : (scores[mid - 1] + scores[mid]) / 2;
}

export function getTestStandardDeviationByGender(
  grades: Grade[],
  students: Student[],
  testId: string,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points);

  if (!scores.length) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance =
    scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    scores.length;

  return Math.sqrt(variance);
}

export function getTestMinByGender(
  grades: Grade[],
  students: Student[],
  testId: string,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points);

  if (!scores.length) return 0;
  return Math.min(...scores);
}

export function getTestMaxByGender(
  grades: Grade[],
  students: Student[],
  testId: string,
  gender: "Male" | "Female"
): number {
  const scores: number[] = grades
    .filter(g => g.testId === testId && g.points !== undefined)
    .filter(g => students.find(s => s.id === g.studentId)?.gender === gender)
    .map(g => g.points);

  if (!scores.length) return 0;
  return Math.max(...scores);
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
      weightedSum += (g.points / test.maxPoints) * test.weight;
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
      return test && test.maxPoints > 0 ? (g.points / test.maxPoints) * 100 : 0;
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
      return test && test.maxPoints > 0 ? (g.points / test.maxPoints) * 100 : 0;
    });

  if (!scores.length) return 0;

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;

  return Math.sqrt(variance);
}

export function getStudentMin(grades: Grade[], studentId: string, tests: Test[]): number {
  const studentGrades = grades
    .filter(g => g.studentId === studentId)
    .map(g => {
      const test = tests.find(t => t.id === g.testId);
      if (!test || test.maxPoints === 0) return 0;
      return (g.points / test.maxPoints) * 100;
    });

  return studentGrades.length ? Math.min(...studentGrades) : 0;
}

export function getStudentMax(grades: Grade[], studentId: string, tests: Test[]): number {
  const studentGrades = grades
    .filter(g => g.studentId === studentId)
    .map(g => {
      const test = tests.find(t => t.id === g.testId);
      if (!test || test.maxPoints === 0) return 0;
      return (g.points / test.maxPoints) * 100;
    });

  return studentGrades.length ? Math.max(...studentGrades) : 0;
}

// Functions for class

export function getClassWeightedAverage(
  grades: Grade[],
  tests: Test[]
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const test of tests) {
    const testGrades = grades.filter(g => g.testId === test.id);
    if (testGrades.length === 0) continue;

    const avgPercentage = testGrades.reduce((sum, g) => sum + (g.points / test.maxPoints) * 100, 0) / testGrades.length;

    totalWeightedScore += avgPercentage * test.weight;
    totalWeight += test.weight;
  }

  return totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
}

export function getClassMedian(grades: Grade[], tests: Test[]): number {
  if (grades.length === 0) return 0;

  const scores = grades.map(g => {
    const test = tests.find(t => t.id === g.testId);
    if (!test || test.maxPoints === 0) return 0;
    return (g.points / test.maxPoints) * 100;
  }).sort((a, b) => a - b);

  const mid = Math.floor(scores.length / 2);

  return scores.length % 2 !== 0
    ? scores[mid]
    : ((scores[mid - 1] + scores[mid]) / 2);
}

export function getClassStandardDeviation(grades: Grade[], tests: Test[]): number {
  if (grades.length === 0) return 0;

  const normalizedScores = grades.map(g => {
    const test = tests.find(t => t.id === g.testId);
    if (!test || test.maxPoints === 0) return 0;
    return (g.points / test.maxPoints) * 100;
  });

  const mean = normalizedScores.reduce((sum, s) => sum + s, 0) / normalizedScores.length;
  const variance = normalizedScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / normalizedScores.length;

  return Math.sqrt(variance);
}

export function getClassMin(grades: Grade[], tests: Test[]): number {
  const relevantGrades = grades
    .filter(g => tests.some(t => t.id === g.testId))
    .map(g => {
      const test = tests.find(t => t.id === g.testId);
      if (!test || test.maxPoints === 0) return 0;
      return (g.points / test.maxPoints) * 100;
    });

  return relevantGrades.length ? Math.min(...relevantGrades) : 0;
}

export function getClassMax(grades: Grade[], tests: Test[]): number {
  const relevantGrades = grades
    .filter(g => tests.some(t => t.id === g.testId))
    .map(g => {
      const test = tests.find(t => t.id === g.testId);
      if (!test || test.maxPoints === 0) return 0;
      return (g.points / test.maxPoints) * 100;
    });

  return relevantGrades.length ? Math.max(...relevantGrades) : 0;
}