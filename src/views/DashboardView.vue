<script setup lang="ts">
import ClassPassRate from '@/components/dashboard/cards/ClassPassRate.vue';
import ClassPerformance from '@/components/dashboard/cards/ClassPerformance.vue';
import FinalGradeStats from '@/components/dashboard/cards/FinalGradeStats.vue';
import MandatoryTestsCount from '@/components/dashboard/cards/MandatoryTestsCount.vue';
import TestGenderComparison from '@/components/dashboard/cards/TestGenderComparison.vue';
import type { DetailedPassRate } from '@/models/DetailedPassRate';
import type { GradeThreshold } from '@/models/GradeThreshold';
import type { PerformanceStats } from '@/models/PerformanceStats';
import { useGradesStore } from '@/stores/useGradesStore';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getStudentFinalGrade } from '@/utility/gradeUtils';
import { getClassMax, getClassMedian, getClassMin, getClassStandardDeviation, getClassWeightedAverage, round2 } from '@/utility/mathUtils';
import { computed } from 'vue';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();
const settingsStore = useSettingsStore();

const sortedGradeThresholds = computed<GradeThreshold[]>(() =>
  gradeThresholdsStore.gradeThresholds
    .slice()
    .sort((a, b) => a.minPercentage - b.minPercentage)
);

const classPerformance = computed<PerformanceStats>(() => {
  const grades = gradesStore.grades;
  const tests = testsStore.tests;

  return {
    weightedAverage: round2(getClassWeightedAverage(grades, tests)),
    median: round2(getClassMedian(grades, tests)),
    standardDeviation: round2(getClassStandardDeviation(grades, tests)),
    min: round2(getClassMin(grades, tests)),
    max: round2(getClassMax(grades, tests))
  };
});

const genderGradeCounts = computed(() => {
  const countsMale: Record<string, number> = {};
  const countsFemale: Record<string, number> = {};

  const students = studentsStore.students;
  const tests = testsStore.tests;
  const grades = gradesStore.grades;
  const settings = settingsStore.settings ?? {
    id: 'global',
    editWithDialog: true,
    frozenStudentInGrades: true,
    lowestGradeForTestMandatory: false,
    lowestGradeForTestFailed: false
  };

  const gradeThresholds = gradeThresholdsStore.gradeThresholds
    .slice()
    .sort((a, b) => a.minPercentage - b.minPercentage);

  gradeThresholds.forEach(th => {
    countsMale[th.name] = 0;
    countsFemale[th.name] = 0;
  });

  for (const student of students) {
    const grade = getStudentFinalGrade(
      grades,
      tests,
      gradeThresholds,
      settings,
      student.id
    );

    if (student.gender === 'Male') {
      countsMale[grade.name]++;
    } else if (student.gender === 'Female') {
      countsFemale[grade.name]++;
    }
  }

  return { countsMale, countsFemale };
});

const passRate = computed<DetailedPassRate>(() => {
  let passed = 0;
  let failed = 0;
  let notTakenMandatory = 0;
  let notTakenOptional = 0;

  testsStore.tests.forEach(test => {
    studentsStore.students.forEach(student => {
      const grade = gradesStore.getGrade(student.id, test.id);

      if (!grade) {
        if (test.isMandatory) {
          notTakenMandatory++;
        } else {
          notTakenOptional++;
        }
      } else if (!test.requiredPoints || grade.points >= test.requiredPoints) {
        passed++;
      } else {
        failed++;
      }
    });
  });

  return {
    passed,
    failed,
    notTakenMandatory,
    notTakenOptional
  };
});


</script>

<template>
  <h1 class="sr-only">Home - Dashboard</h1>
  <h2 class="title-section">Dashboard</h2>
  <div class="cards-section">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <FinalGradeStats :grade-thresholds="sortedGradeThresholds" :counts-male="genderGradeCounts.countsMale" :counts-female="genderGradeCounts.countsFemale"
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ClassPassRate :pass-rate="passRate"
      class="
      sm:col-span-1
      lg:col-span-1
      "/>
      <MandatoryTestsCount :tests="testsStore.tests"
      class="
      sm:col-span-1
      lg:col-span-1
      "/>
      <ClassPerformance :class-performance="classPerformance"
      class="
      sm:col-span-2
      lg:col-span-2
      "/>
      <TestGenderComparison :tests="testsStore.tests" :students="studentsStore.students" :grades="gradesStore.grades"
      class="
      sm:col-span-2
      lg:col-span-2
      "/>
    </div>
  </div>
</template>

