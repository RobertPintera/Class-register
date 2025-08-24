import type { Grade } from "@/models/Grade";
import { defineStore } from "pinia";
import { db } from "@/database/database";
import { computed, ref } from "vue";

export const useGradesStore = defineStore('grades', () => {
  const _grades = ref<Grade[]>([]);
  const grades = computed(() => _grades.value);

  const updateGrade = async (grade: Grade) => {
    const updatedGrade: Grade = { ...grade };
    const existingGrade = _grades.value.find(g => g.studentId === updatedGrade.studentId && g.testId === updatedGrade.testId);
    if (existingGrade) {
      existingGrade.points = updatedGrade.points;
      await db.updateGrade(existingGrade.testId, existingGrade.studentId, {points: existingGrade.points});
    } else {
      _grades.value.push(updatedGrade);
      await db.addGrade(updatedGrade);
    }
  };

  const deleteGrade = async (studentId: string, testId: string) => {
    await db.deleteGrade(studentId, testId);
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

  return {
    grades,
    updateGrade, deleteGrade, getGrade, setGrades
  };
});