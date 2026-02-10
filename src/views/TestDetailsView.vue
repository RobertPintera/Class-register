<script setup lang="ts">
import ActionsTest from '@/components/testDetails/cards/ActionsTest.vue';
import InfoData from '@/components/testDetails/cards/InfoData.vue';
import TestPerformance from '@/components/testDetails/cards/TestPerformance.vue';
import TestPassRate from '@/components/testDetails/cards/TestPassRate.vue';
import TestPassRateByGender from '@/components/testDetails/cards/TestPassRateByGender.vue';
import TestPerformanceByGender from '@/components/testDetails/cards/TestPerformanceByGender.vue';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getTestAverage, getTestAverageByGender, getTestMax, getTestMaxByGender, getTestMedian, getTestMedianByGender, getTestMin, getTestMinByGender, getTestStandardDeviation, getTestStandardDeviationByGender, round2 } from '@/utility/mathUtils';
import { computed, onMounted, ref, watch } from 'vue';
import TestResultsDatatable from '@/components/testDetails/cards/TestResultsDatatable.vue';
import TestResults from '@/components/testDetails/cards/TestResults.vue';
import type { PerformanceStats } from '@/models/PerformanceStats';
import type { PassRate } from '@/models/PassRate';
import type { StudentResult } from '@/models/StudentResult';
import { GENDER } from '@/constants/constants';
import type { Test } from '@/models/Test';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const props = defineProps<{ testId: string }>();
const test = computed<Test | undefined>(() => testsStore.getTest(props.testId));

const classPerformance = computed<PerformanceStats>(() => {
  if (!test.value) return {
    weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
  };

  const grades = gradesStore.grades;
  const testId = props.testId;

  return {
    weightedAverage: round2(getTestAverage(grades, testId)),
    median: round2(getTestMedian(grades, testId)),
    standardDeviation: round2(getTestStandardDeviation(grades, testId)),
    min: round2(getTestMin(grades, testId)),
    max: round2(getTestMax(grades, testId))
  };
});

const classPerformanceByMale = computed<PerformanceStats>(() => {
  if (!test.value) return {
    weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
  };
  return {
    weightedAverage: round2(getTestAverageByGender(gradesStore.grades, studentsStore.students, props.testId, "Male")),
    median: round2(getTestMedianByGender(gradesStore.grades, studentsStore.students, props.testId, "Male")),
    standardDeviation: round2(getTestStandardDeviationByGender(gradesStore.grades, studentsStore.students, props.testId, "Male")),
    min: round2(getTestMinByGender(gradesStore.grades, studentsStore.students, props.testId, "Male")),
    max: round2(getTestMaxByGender(gradesStore.grades, studentsStore.students, props.testId, "Male"))
  };
});

const classPerformanceByFemale = computed<PerformanceStats>(() => {
  if (!test.value) return {
    weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
  };
  return {
    weightedAverage: round2(getTestAverageByGender(gradesStore.grades, studentsStore.students, props.testId, "Female")),
    median: round2(getTestMedianByGender(gradesStore.grades, studentsStore.students, props.testId, "Female")),
    standardDeviation: round2(getTestStandardDeviationByGender(gradesStore.grades, studentsStore.students, props.testId, "Female")),
    min: round2(getTestMinByGender(gradesStore.grades, studentsStore.students, props.testId, "Female")),
    max: round2(getTestMaxByGender(gradesStore.grades, studentsStore.students, props.testId, "Female"))
  };
});

const passRateByMale = computed(() => {
  if (!test.value) return { passed: 0, failed: 0, notTaken: 0 };

  const t = test.value;
  const stats = { passed: 0, failed: 0, notTaken: 0 };
  studentsStore.students
    .filter(s => s.gender === "Male")
    .forEach(s => {
      const grade = gradesStore.getGrade(s.id, t.id);
      if (!grade) stats.notTaken++;
      else if (t.requiredPoints === null || grade.points >= t.requiredPoints) stats.passed++;
      else stats.failed++;
    });
  return stats;
});

const passRateByFemale = computed(() => {
  if (!test.value) return { passed: 0, failed: 0, notTaken: 0 };

  const t = test.value;
  const stats = { passed: 0, failed: 0, notTaken: 0 };
  studentsStore.students
    .filter(s => s.gender === "Female")
    .forEach(s => {
      const grade = gradesStore.getGrade(s.id, t.id);
      if (!grade) stats.notTaken++;
      else if (t.requiredPoints === null || grade.points >= t.requiredPoints) stats.passed++;
      else stats.failed++;
    });
  return stats;
});

const passRate = computed(() => ({
  passed: passRateByMale.value.passed + passRateByFemale.value.passed,
  failed: passRateByMale.value.failed + passRateByFemale.value.failed,
  notTaken: passRateByMale.value.notTaken + passRateByFemale.value.notTaken
}));


const results = computed<StudentResult[]>(() => {
  return gradesStore.grades
    .filter(g => g.testId === props.testId)
    .map(g => {
      const student = studentsStore.students.find(s => s.id === g.studentId);

      const maxPoints = test.value?.maxPoints ?? 100;
      const requiredPoints = test.value?.requiredPoints ?? 0;
      const percentage = round2((g.points / maxPoints) * 100);
      const status = g.points >= requiredPoints;
      return {
        name: student?.name ?? "-",
        surname: student?.surname ?? "-",
        points: g.points,
        percentage: percentage,
        status: status
      };
    });
});

</script>

<template>
  <h1 class="sr-only">Register - Test details</h1>
  <h2 class="title-section">Test details</h2>
  <div class="cards-section">
    <div v-if="test" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <InfoData :name="test?.name" :weight="test?.weight" :required-points="test?.requiredPoints" :max-points="test?.maxPoints" :is-mandatory="test?.isMandatory"
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ActionsTest :test="test" :performance="classPerformance" 
      :male-performance="classPerformanceByMale" :female-performace="classPerformanceByFemale" 
      :pass-rate="passRate" :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-1 lg:row-start-2"/>
      <TestPassRate :pass-rate="passRate"
      class="
      lg:row-span-2 lg:col-start-3 lg:row-start-1"/>
      <TestPassRateByGender :pass-rate-by-male="passRateByMale" :pass-rate-by-female="passRateByFemale"
      class="
      lg:row-span-2 lg:col-start-4 lg:row-start-1"/>
      <TestPerformance :class-performance="classPerformance" :max-points="test.maxPoints"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-3"/>
      <TestPerformanceByGender :male-data="classPerformanceByMale" :female-data="classPerformanceByFemale"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-3"/>
      <TestResults :test="test" :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-4"/>
      <TestResultsDatatable :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-4"/>
    </div>
  </div>
</template>