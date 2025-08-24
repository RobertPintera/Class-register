import { defineStore } from "pinia";
import { db } from "@/database/database";
import { computed, ref } from "vue";
import type { StudentGrades } from "@/models/StudentGrades";
import { useGradesStore } from "./useGradesStore";
import { useGradeThresholdsStore } from "./useGradeThresholdsStore";
import { useSettingsStore } from "./useSettingsStore";
import { useStudentsStore } from "./useStudentsStore";
import { useTestsStore } from "./useTestsStore";

export const useRegisterStore = defineStore('register', () => {
  const _isLoading = ref(false);
  const isLoading = computed(() => _isLoading.value);

  const gradesStore = useGradesStore();
  const gradeThresholdsStore = useGradeThresholdsStore();
  const settingsStore = useSettingsStore();
  const studentsStore = useStudentsStore();
  const testsStore = useTestsStore();  

  const loadData = async () => {
    if (_isLoading.value) return;
    _isLoading.value = true;

    await db.initSettings();
    await db.initGradeThresholds();
    
    gradeThresholdsStore.setGradeThresholds(await db.getGradeThresholds());
    settingsStore.setSettings(await db.getSettings() ?? {id: 'global', editWithDialog: true});
    studentsStore.setStudents(await db.getAllStudents());
    testsStore.setTests(await db.getAllTests());
    gradesStore.setGrades(await db.getAllGrades());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const loadDemoData = async () => {
    if (isLoading.value) return;
    _isLoading.value = true;

    await db.createDemoData();
    
    gradeThresholdsStore.setGradeThresholds(await db.getGradeThresholds());
    settingsStore.setSettings(await db.getSettings() ?? {id: 'global', editWithDialog: true});
    studentsStore.setStudents(await db.getAllStudents());
    testsStore.setTests(await db.getAllTests());
    gradesStore.setGrades(await db.getAllGrades());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const testColumns = computed(() =>
    testsStore.tests.map(test => ({
      field: test.id,
      header: test.name,
    }))
  );

  const studentGrades = computed<StudentGrades[]>(() =>
    studentsStore.students.map(student => {
      const row: StudentGrades = {
        studentId: student.id,
        fullName: `${student.name} ${student.surname}`,
      };

      for (const test of testsStore.tests) {
        const grade = gradesStore.grades.find(
          g => g.studentId === student.id && g.testId === test.id
        );
        row[test.id] = grade ? grade.points : -1;
      }

      return row;
    })
  );

  return {
    isLoading,
    testColumns, studentGrades,
    loadData, loadDemoData,
  };
});