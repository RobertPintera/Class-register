import type { Grade } from "@/models/Grade";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { addGradeDb, deleteGradeDb, deleteGradesByTestDb, updateGradeDb } from "@/database/gradesDb";
import { round1 } from "@/utility/mathUtils";

export const useGradesStore = defineStore('grades', () => {
  const _grades = ref<Grade[]>([]);
  const grades = computed(() => _grades.value);

  const updateGrade = async (grade: Grade) => {
    const updatedGrade: Grade = { ...grade };
    const existingGrade = _grades.value.find(g => g.studentId === updatedGrade.studentId && g.testId === updatedGrade.testId);
    if (existingGrade) {
      existingGrade.points = updatedGrade.points;
      await updateGradeDb(existingGrade.testId, existingGrade.studentId, {points: existingGrade.points});
    } else {
      _grades.value.push(updatedGrade);
      await addGradeDb(updatedGrade);
    }
  };

  const deleteGrade = async (studentId: string, testId: string) => {
    await deleteGradeDb(studentId, testId);
    _grades.value = _grades.value.filter(
      g => !(g.studentId === studentId && g.testId === testId)
    );
  };

  const setGrades = (newStudents: Grade[]) => {
    _grades.value = newStudents;
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
        .map(g => updateGradeDb(g.testId, g.studentId, { points: g.points }))
    );

    _grades.value = newGrades;
  };

  const normalizeGradesByTest = async (testId: string, oldMax: number, newMax: number) => {
    const newGrades = _grades.value.map(g => {
      if (g.testId === testId) {
        const normalizedPoints = round1((g.points / oldMax) * newMax);
        return { ...g, points: normalizedPoints };
      }
      return g;
    });

    await Promise.all(
      newGrades
        .filter(g => g.testId === testId)
        .map(g => updateGradeDb(g.testId, g.studentId, { points: g.points }))
    );

    _grades.value = newGrades;
  };

  const deleteGradesByTest = async (testId: string) => {
    await deleteGradesByTestDb(testId);
    _grades.value = _grades.value.filter(g => g.testId !== testId);
  };

  return {
    grades,
    updateGrade, deleteGrade, getGrade, setGrades, reduceGradesByTest, normalizeGradesByTest, deleteGradesByTest
  };
});