import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { StudentGrades } from "@/models/StudentGrades";
import { useGradesStore } from "./useGradesStore";
import { useGradeThresholdsStore } from "./useGradeThresholdsStore";
import { useSettingsStore } from "./useSettingsStore";
import { useStudentsStore } from "./useStudentsStore";
import { useTestsStore } from "./useTestsStore";
import { saveAs } from 'file-saver';
import { settingsService } from "@/services/settingsService";
import { gradeThresholdService } from "@/services/gradeThresholdService";
import { studentService } from "@/services/studentSerivce";
import { testService } from "@/services/testService";
import { gradeService } from "@/services/gradeService";
import { registerService } from "@/services/registerService";

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

    await settingsService.initSettings();
    await gradeThresholdService.initGradeThresholds();
    
    gradeThresholdsStore.setGradeThresholds(await gradeThresholdService.getAllGradeThresholds());
    settingsStore.setSettings(await settingsService.getSettings() ?? 
    {id: 'global', editWithDialog: true, frozenStudentInGrades: true, lowestGradeForTestMandatory: false, lowestGradeForTestFailed: false});
    studentsStore.setStudents(await studentService.getAllStudents());
    testsStore.setTests(await testService.getAllTests());
    gradesStore.setGrades(await gradeService.getAllGrades());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const loadDemoData = async () => {
    if (isLoading.value) return;
    _isLoading.value = true;

    await registerService.createDemoData();
    
    gradeThresholdsStore.setGradeThresholds(await gradeThresholdService.getAllGradeThresholds());
    settingsStore.setSettings(await settingsService.getSettings() ?? 
    {id: 'global', editWithDialog: true, frozenStudentInGrades: true, lowestGradeForTestMandatory: false, lowestGradeForTestFailed: false});
    studentsStore.setStudents(await studentService.getAllStudents());
    testsStore.setTests(await testService.getAllTests());
    gradesStore.setGrades(await gradeService.getAllGrades());

    await new Promise(resolve => setTimeout(resolve, 500));
    _isLoading.value = false;
  };

  const exportToJson = async () => {
    const blob = await registerService.exportToJson();
    saveAs(blob, "register-class-data.json");
  };

  const importFromJson = async (json: string) => {
    await registerService.importFromJson(json);
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