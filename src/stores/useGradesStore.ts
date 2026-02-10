import type { Grade } from "@/models/Grade";
import { defineStore } from "pinia";
import { computed, onScopeDispose, ref } from "vue";
import { round1 } from "@/utility/mathUtils";
import { gradeService } from "@/services/gradeService";

export const useGradesStore = defineStore('grades', () => {
  const _grades = ref<Grade[]>([]);
  const grades = computed(() => _grades.value);

  const subscription = gradeService
    .getAllGrades()
    .subscribe((data) => {
      _grades.value = data;
    });

  onScopeDispose(() => {
    subscription.unsubscribe();
  });

  const updateGrade = async (grade: Grade) => {
    const updatedGrade: Grade = { ...grade };
    const existingGrade = _grades.value.find(g => g.studentId === updatedGrade.studentId && g.testId === updatedGrade.testId);
    if (existingGrade) {
      existingGrade.points = updatedGrade.points;
      await gradeService.updateGrade(existingGrade.testId, existingGrade.studentId, {points: existingGrade.points});
    } else {
      await gradeService.addGrade(updatedGrade);
    }
  };

  const deleteGrade = async (studentId: string, testId: string) => {
    await gradeService.deleteGrade(studentId, testId);
  };

  const getGrade = (studentId: string, testId: string): Grade | undefined => {
    return _grades.value.find(
      g => g.studentId === studentId && g.testId === testId
    );
  };

  const reduceGradesByTest = async (testId: string, newMax: number) => {
    const newGrades = _grades.value.map(g => {
      if (g.testId === testId && g.points > newMax) {
        return { ...g, points: newMax };
      }
      return g;
    });

    await Promise.all(
      newGrades
        .filter(g => g.testId === testId)
        .map(g => gradeService.updateGrade(g.testId, g.studentId, { points: g.points }))
    );
  };

  const normalizeGradesByTest = async (testId: string, oldMax: number, newMax: number) => {
    const newGrades = _grades.value.map(g => {
      if (g.testId === testId) {
        const normalizedPoints = round1((g.points / oldMax) * newMax);
        return { ...g, points: normalizedPoints };
      }
      return g;
    });

    const gradesToUpdate = newGrades.filter(g => g.testId === testId);

    await Promise.all(
      gradesToUpdate.map(g => gradeService.updateGrade(g.testId, g.studentId, { points: g.points }))
    );
  };

  const deleteGradesByTest = async (testId: string) => {
    await gradeService.deleteGradesByTest(testId);
  };

  return {
    grades,
    updateGrade, deleteGrade, getGrade, reduceGradesByTest, normalizeGradesByTest, deleteGradesByTest
  };
});