<script setup lang="ts">
import ActionsTest from '@/components/testDetails/cards/ActionsTest.vue';
import InfoData from '@/components/testDetails/cards/InfoData.vue';
import TestPerformance from '@/components/testDetails/cards/TestPerformance.vue';
import TestPassRate from '@/components/testDetails/cards/TestPassRate.vue';
import TestPassRateByGender from '@/components/testDetails/cards/TestPassRateByGender.vue';
import TestPerformanceByGender from '@/components/testDetails/cards/TestPerformanceByGender.vue';
import type { Test } from '@/models/Test';
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

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const props = defineProps<{ testId: string }>();
const test = ref<Test>();

const classPerformace = ref<PerformanceStats>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});
const classPerformacebyMale = ref<PerformanceStats>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});
const classPerformacebyFemale = ref<PerformanceStats>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});
const passRate = ref<PassRate>({passed: 0, failed: 0, notTaken: 0});
const passRateByMale = ref<PassRate>({passed: 0, failed: 0, notTaken: 0});
const passRateByFemale = ref<PassRate>({passed: 0, failed: 0, notTaken: 0});

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

const loadTestData = () => {
  const t = testsStore.getTest(props.testId);
  if (!t) return;

  const students = studentsStore.students;
  const grades = gradesStore.grades;

  // Set test
  test.value = t;

  // Set performance
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

  // Set pass rate
  const stats: Record<string, PassRate> = {};
  Object.values(GENDER).forEach(g => {
    stats[g] = { passed: 0, failed: 0, notTaken: 0 };
  });

  studentsStore.students.filter(student => {
    const grade = gradesStore.getGrade(student.id, props.testId);
    const gender = student.gender;

    if (!grade) {
      stats[gender].notTaken++;
    } else if (t.requiredPoints === null || grade.points >= t.requiredPoints) {
      stats[gender].passed++;
    } else {
      stats[gender].failed++;
    }
  });

  passRateByMale.value = stats[GENDER.MALE];
  passRateByFemale.value = stats[GENDER.FEMALE];

  passRate.value = {
    passed: stats[GENDER.MALE].passed + stats[GENDER.FEMALE].passed,
    failed: stats[GENDER.MALE].failed + stats[GENDER.FEMALE].failed,
    notTaken: stats[GENDER.MALE].notTaken + stats[GENDER.FEMALE].notTaken
  };
};

onMounted(() => {
  loadTestData();
});

watch(
  () => testsStore.tests, () => {
    loadTestData();
  }, { deep: true }
);
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
      <ActionsTest :test="test" :performance="classPerformace" 
      :male-performance="classPerformacebyMale" :female-performace="classPerformacebyFemale" 
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
      <TestPerformance :class-performance="classPerformace" :max-points="test.maxPoints"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-3"/>
      <TestPerformanceByGender :male-data="classPerformacebyMale" :female-data="classPerformacebyFemale"
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