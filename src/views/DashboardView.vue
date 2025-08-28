<script setup lang="ts">
import ClassPassRate from '@/components/dashboard/cards/ClassPassRate.vue';
import ClassPerformance from '@/components/dashboard/cards/ClassPerformance.vue';
import FinalGradeStats from '@/components/dashboard/cards/FinalGradeStats.vue';
import MandatoryTestsCount from '@/components/dashboard/cards/MandatoryTestsCount.vue';
import TestGenderComparison from '@/components/dashboard/cards/TestGenderComparison.vue';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getClassMax, getClassMedian, getClassMin, getClassStandardDeviation, getClassWeightedAverage, round2 } from '@/utility/mathUtils';
import { onMounted, ref } from 'vue';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const classPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const loadClassData = () => {
  const tests = testsStore.tests;
  const grades = gradesStore.grades;

  classPerformace.value = {
    weightedAverage: round2(getClassWeightedAverage(grades, tests)),
    median: round2(getClassMedian(grades, tests)),
    standardDeviation: round2(getClassStandardDeviation(grades, tests)),
    min: round2(getClassMin(grades, tests)),
    max: round2(getClassMax(grades, tests))
  };
};

onMounted(() => {
  loadClassData();
});
</script>

<template>
  <h2 class="title-section">Dashboard</h2>
  <div class="cards-section">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <FinalGradeStats 
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ClassPassRate
      class="
      sm:col-span-1
      lg:col-span-1
      "/>
      <MandatoryTestsCount
      class="
      sm:col-span-1
      lg:col-span-1
      "/>
      <ClassPerformance :class-performance="classPerformace"
      class="
      sm:col-span-2
      lg:col-span-2
      "/>
      <TestGenderComparison
      class="
      sm:col-span-2
      lg:col-span-2
      "/>
    </div>
  </div>
</template>

