<script setup lang="ts">
import ActionsTest from '@/components/testDetails/ActionsTest.vue';
import InfoData from '@/components/testDetails/InfoData.vue';
import TestPerformance from '@/components/testDetails/Performance/TestPerformance.vue';
import TestPassRate from '@/components/testDetails/TestPassRate.vue';
import TestPassRateByGender from '@/components/testDetails/TestPassRateByGender.vue';
import TestPerformanceByGender from '@/components/testDetails/TestPerformanceByGender.vue';
import type { Test } from '@/models/Test';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { getTestAverage, getTestAverageByGender, getTestMax, getTestMaxByGender, getTestMedian, getTestMedianByGender, getTestMin, getTestMinByGender, getTestStandardDeviation, getTestStandardDeviationByGender, round2 } from '@/utility/mathUtils';
import { onMounted, ref } from 'vue';

const registerStore = useRegisterStore();
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

function loadTestData(){
  const t = registerStore.getTest(props.testId);
  if (!t) return;
  test.value = t;

  classPerformace.value = {
    weightedAverage: round2(getTestAverage(registerStore.grades, props.testId)),
    median: round2(getTestMedian(registerStore.grades, props.testId)),
    standardDeviation: round2(getTestStandardDeviation(registerStore.grades, props.testId)),
    min: round2(getTestMin(registerStore.grades, props.testId)),
    max: round2(getTestMax(registerStore.grades, props.testId))
  };

  classPerformacebyMale.value = {
    weightedAverage: round2(getTestAverageByGender(registerStore.grades, registerStore.students, props.testId, "Male")),
    median: round2(getTestMedianByGender(registerStore.grades, registerStore.students, props.testId, "Male")),
    standardDeviation: round2(getTestStandardDeviationByGender(registerStore.grades, registerStore.students, props.testId, "Male")),
    min: round2(getTestMinByGender(registerStore.grades, registerStore.students, props.testId, "Male")),
    max: round2(getTestMaxByGender(registerStore.grades, registerStore.students, props.testId, "Male"))
  };

  classPerformacebyFemale.value = {
    weightedAverage: round2(getTestAverageByGender(registerStore.grades, registerStore.students, props.testId, "Female")),
    median: round2(getTestMedianByGender(registerStore.grades, registerStore.students, props.testId, "Female")),
    standardDeviation: round2(getTestStandardDeviationByGender(registerStore.grades, registerStore.students, props.testId, "Female")),
    min: round2(getTestMinByGender(registerStore.grades, registerStore.students, props.testId, "Female")),
    max: round2(getTestMaxByGender(registerStore.grades, registerStore.students, props.testId, "Female"))
  };
}

onMounted(() => {
  loadTestData();
});
</script>

<template>
  <h2 class="title-section">Test Details</h2>
  <div class="cards-section">
    <div v-if="test" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <InfoData class="col-span-2" :name="test?.name" :weight="test?.weight" :required-points="test?.requiredPoints" :max-points="test?.maxPoints" :is-mandatory="test?.isMandatory"/>
      <ActionsTest class="col-span-2 col-start-1 row-start-2"/>
      <TestPassRate :test-id="test.id" :required-points="test.requiredPoints" class="row-span-2 col-start-3 row-start-1"/>
      <TestPassRateByGender :test-id="test.id" :required-points="test.requiredPoints" class="row-span-2 col-start-4 row-start-1"/>
      <TestPerformance :class-performance="classPerformace" class="col-span-2 col-start-1 row-start-3"/>
      <TestPerformanceByGender :male-data="classPerformacebyMale" :female-data="classPerformacebyFemale" class="col-span-2 col-start-3 row-start-3"/>
    </div>
  </div>
</template>