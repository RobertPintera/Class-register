<script setup lang="ts">
import ActionsTest from '@/components/testDetails/ActionsTest.vue';
import InfoData from '@/components/testDetails/InfoData.vue';
import TestPerformance from '@/components/testDetails/TestPerformance.vue';
import StudentResults from '@/components/testDetails/StudentResults.vue';
import StudentResultsDatatable from '@/components/testDetails/StudentResultsDatatable.vue';
import TestPassRate from '@/components/testDetails/TestPassRate.vue';
import TestPassRateByGender from '@/components/testDetails/TestPassRateByGender.vue';
import TestPerformanceByGender from '@/components/testDetails/TestPerformanceByGender.vue';
import type { Test } from '@/models/Test';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getTestAverage, getTestAverageByGender, getTestMax, getTestMaxByGender, getTestMedian, getTestMedianByGender, getTestMin, getTestMinByGender, getTestStandardDeviation, getTestStandardDeviationByGender, round2 } from '@/utility/mathUtils';
import { onMounted, ref } from 'vue';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const props = defineProps<{ testId: string }>();
const test = ref<Test>();

const classPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const classPerformacebyMale = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const classPerformacebyFemale = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const loadTestData = () => {
  const t = testsStore.getTest(props.testId);
  if (!t) return;

  const students = studentsStore.students;
  const grades = gradesStore.grades;
  test.value = t;

  classPerformace.value = {
    weightedAverage: round2(getTestAverage(grades, props.testId)),
    median: round2(getTestMedian(grades, props.testId)),
    standardDeviation: round2(getTestStandardDeviation(grades, props.testId)),
    min: round2(getTestMin(grades, props.testId)),
    max: round2(getTestMax(grades, props.testId))
  };

  classPerformacebyMale.value = {
    weightedAverage: round2(getTestAverageByGender(grades, students, props.testId, "Male")),
    median: round2(getTestMedianByGender(grades, students, props.testId, "Male")),
    standardDeviation: round2(getTestStandardDeviationByGender(grades, students, props.testId, "Male")),
    min: round2(getTestMinByGender(grades, students, props.testId, "Male")),
    max: round2(getTestMaxByGender(grades, students, props.testId, "Male"))
  };

  classPerformacebyFemale.value = {
    weightedAverage: round2(getTestAverageByGender(grades, students, props.testId, "Female")),
    median: round2(getTestMedianByGender(grades, students, props.testId, "Female")),
    standardDeviation: round2(getTestStandardDeviationByGender(grades, students, props.testId, "Female")),
    min: round2(getTestMinByGender(grades, students, props.testId, "Female")),
    max: round2(getTestMaxByGender(grades, students, props.testId, "Female"))
  };
};

onMounted(() => {
  loadTestData();
});
</script>

<template>
  <h2 class="title-section">Test Details</h2>
  <div class="cards-section">
    <div v-if="test" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <InfoData :name="test?.name" :weight="test?.weight" :required-points="test?.requiredPoints" :max-points="test?.maxPoints" :is-mandatory="test?.isMandatory"
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ActionsTest
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-1 lg:row-start-2"/>
      <TestPassRate :test-id="test.id" :required-points="test.requiredPoints"
      class="
      lg:row-span-2 lg:col-start-3 lg:row-start-1"/>
      <TestPassRateByGender :test-id="test.id" :required-points="test.requiredPoints"
      class="
      lg:row-span-2 lg:col-start-4 lg:row-start-1"/>
      <TestPerformance :class-performance="classPerformace"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-3"/>
      <TestPerformanceByGender :male-data="classPerformacebyMale" :female-data="classPerformacebyFemale"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-3"/>
      <StudentResults :test-id="test.id" :max-score="test.maxPoints"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-4"/>
      <StudentResultsDatatable :test-id="test.id" :required-points="test.requiredPoints" :max-points="test.maxPoints"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-4"/>
    </div>
  </div>
</template>