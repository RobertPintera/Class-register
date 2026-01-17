import type { Test } from "@/models/Test";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useGradesStore } from "./useGradesStore";
import { testService } from "@/services/testService";


export const useTestsStore = defineStore('tests', () => {
  const gradesStore = useGradesStore();
  const _tests = ref<Test[]>([]);
  const tests = computed(() => _tests.value);
  
  const addTest = async (test: Omit<Test, 'id'>) => {
    const newTest = await testService.addTest(test);
    _tests.value.push(newTest);
  };

  const updateTest = async (id: string, updated: Partial<Omit<Test, 'id'>>) => {
    testService.updateTest(id, updated);
    const index = _tests.value.findIndex(t => t.id === id);
    if (index !== -1) {
      _tests.value[index] = { ..._tests.value[index], ...updated };
    }
  };

  const deleteTest = async (testId: string) => {
    await testService.deleteTest(testId);
    _tests.value = _tests.value.filter(t => t.id !== testId);
    gradesStore.setGrades(gradesStore.grades.filter(g => g.testId !== testId));
  };

  const setTests = (newTests: Test[]) => {
    _tests.value = newTests;
  };

  const getTest = (testId: string): Test | undefined => {
    return _tests.value.find(t => t.id === testId);
  };

  return{
    tests,
    addTest, updateTest, deleteTest, getTest, setTests
  };
});