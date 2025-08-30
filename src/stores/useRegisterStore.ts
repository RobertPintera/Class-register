import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { StudentGrades } from "@/models/StudentGrades";
import { useGradesStore } from "./useGradesStore";
import { useGradeThresholdsStore } from "./useGradeThresholdsStore";
import { useSettingsStore } from "./useSettingsStore";
import { useStudentsStore } from "./useStudentsStore";
import { useTestsStore } from "./useTestsStore";
import { getSettingsDb, initSettingsDb } from "@/database/settingsDb";
import { getGradeThresholdsDb, initGradeThresholdsDb } from "@/database/gradeThresholdsDb";
import { getAllStudentsDb } from "@/database/studentsDb";
import { getAllTestsDb } from "@/database/testsDb";
import { getAllGradesDb } from "@/database/gradesDb";
import { createDemoDataDb, exportToJsonDb, importFromJsonDb } from "@/database/registerDb";
import { saveAs } from 'file-saver';

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

    await initSettingsDb();
    await initGradeThresholdsDb();
    
    gradeThresholdsStore.setGradeThresholds(await getGradeThresholdsDb());
    settingsStore.setSettings(await getSettingsDb() ?? {id: 'global', editWithDialog: true});
    studentsStore.setStudents(await getAllStudentsDb());
    testsStore.setTests(await getAllTestsDb());
    gradesStore.setGrades(await getAllGradesDb());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const loadDemoData = async () => {
    if (isLoading.value) return;
    _isLoading.value = true;

    await createDemoDataDb();
    
    gradeThresholdsStore.setGradeThresholds(await getGradeThresholdsDb());
    settingsStore.setSettings(await getSettingsDb() ?? {id: 'global', editWithDialog: true});
    studentsStore.setStudents(await getAllStudentsDb());
    testsStore.setTests(await getAllTestsDb());
    gradesStore.setGrades(await getAllGradesDb());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const exportToJson = async () => {
    const blob = await exportToJsonDb();
    saveAs(blob, "register-class-data.json");
  };

  const importFromJson = async (json: string) => {
    await importFromJsonDb(json);
    await loadData();
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
    loadData, loadDemoData, exportToJson, importFromJson
  };
});