import type { Test } from "@/models/Test";
import { defineStore } from "pinia";
import { computed, onScopeDispose, ref } from "vue";
import { testService } from "@/services/testService";


export const useTestsStore = defineStore('tests', () => {
  const _tests = ref<Test[]>([]);
  const tests = computed(() => _tests.value);
  
  const subscription = testService
    .getAllTests()
    .subscribe((data) => {
      _tests.value = data;
    });

  onScopeDispose(() => {
    subscription.unsubscribe();
  });


  const addTest = async (test: Omit<Test, 'id'>) => {
    const newTest = await testService.addTest(test);
    _tests.value.push(newTest);
  };

  const updateTest = async (id: string, updated: Partial<Omit<Test, 'id'>>) => {
    testService.updateTest(id, updated);
  };

  const deleteTest = async (testId: string) => {
    await testService.deleteTest(testId);
  };

  const getTest = (testId: string): Test | undefined => {
    return _tests.value.find(t => t.id === testId);
  };

  return{
    tests,
    addTest, updateTest, deleteTest, getTest
  };
});