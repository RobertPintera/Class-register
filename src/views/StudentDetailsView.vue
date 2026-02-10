<script setup lang="ts">
import ActionsStudent from '@/components/studentDetails/cards/ActionsStudent.vue';
import ComparisionClass from '@/components/studentDetails/cards/ComparisionClass.vue';
import FinalGradeResult from '@/components/studentDetails/cards/FinalGradeResult.vue';
import PersonalData from '@/components/studentDetails/cards/PersonalData.vue';
import StudentResults from '@/components/studentDetails/cards/StudentResults.vue';
import StudentResultsDatatable from '@/components/studentDetails/cards/StudentResultsDatatable.vue';
import StudentPassRate from '@/components/studentDetails/cards/StudentPassRate.vue';
import type { Student } from '@/models/Student';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getClassMax, getClassMedian, getClassMin, getClassStandardDeviation, getClassWeightedAverage, getStudentMax, getStudentMedian, getStudentMin, getStudentStandardDeviation, getStudentWeightedAverage, round2 } from '@/utility/mathUtils';
import { computed, onMounted, ref, watch } from 'vue';
import StudentPerformance from '@/components/studentDetails/cards/StudentPerformance.vue';
import { getStudentFinalGrade } from '@/utility/gradeUtils';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import type { GradeThreshold } from '@/models/GradeThreshold';
import type { GradeStats } from '@/models/GradeStats';
import type { PerformanceStats } from '@/models/PerformanceStats';
import type { TestResult } from '@/models/TestResult';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { DetailedPassRate } from '@/models/DetailedPassRate';
import { defaultSettings } from '@/constants/constants';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();
const settingsStore = useSettingsStore();

const props = defineProps<{ studentId: string }>();

const student = computed(() => studentsStore.getStudent(props.studentId));

const finalGrade = computed<GradeThreshold>(() => {
  const settings = settingsStore.settings ?? defaultSettings;
  return getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, settings, props.studentId);
});

const gradeStats = computed(() => {
  const studentGrade = finalGrade.value;
  if (!studentGrade) return { lowerValue: 0, higherValue: 100 };

  const students = studentsStore.students;
  const settings = settingsStore.settings ?? defaultSettings;

  const total = students.length || 1;

  const higher = (students.filter(s => {
    const grade = getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, settings, s.id);
    return grade.minPercentage > studentGrade.minPercentage; 
  }).length / total) * 100;
  const lower = 100 - higher;

  const lowerRounded = Math.round(lower);
  const higherRounded = 100 - lowerRounded;

  return { lowerValue: lowerRounded, higherValue: higherRounded };
});

const individualPerformace = computed<PerformanceStats>(() => {
  const grades = gradesStore.grades;
  const studentTests = testsStore.tests.filter(test =>
    grades.some(g => g.studentId === props.studentId && g.testId === test.id)
  );

  return {
    weightedAverage: round2(getStudentWeightedAverage(grades, studentTests, props.studentId)),
    median: round2(getStudentMedian(grades, studentTests, props.studentId)),
    standardDeviation: round2(getStudentStandardDeviation(grades, studentTests, props.studentId)),
    min: round2(getStudentMin(grades, props.studentId, studentTests)),
    max: round2(getStudentMax(grades, props.studentId, studentTests))
  };
});

const classPerformace = computed<PerformanceStats>(() => {
  const grades = gradesStore.grades;
  const studentTests = testsStore.tests.filter(test =>
    grades.some(g => g.studentId === props.studentId && g.testId === test.id)
  );

  return {
    weightedAverage: round2(getClassWeightedAverage(grades, studentTests)),
    median: round2(getClassMedian(grades, studentTests)),
    standardDeviation: round2(getClassStandardDeviation(grades, studentTests)),
    min: round2(getClassMin(grades, studentTests)),
    max: round2(getClassMax(grades, studentTests))
  };
});

const passRate = computed<DetailedPassRate>(() => {
  const result: DetailedPassRate = { passed: 0, failed: 0, notTakenOptional: 0, notTakenMandatory: 0 };

  testsStore.tests.forEach(test => {
    const grade = gradesStore.getGrade(props.studentId, test.id);
    if (!grade) {
      if (test.isMandatory) result.notTakenMandatory++;
      else result.notTakenOptional++;
    } else if (!test.requiredPoints || grade.points >= test.requiredPoints) {
      result.passed++;
    } else {
      result.failed++;
    }
  });

  return result;
});

const results = computed<TestResult[]>(() => {
  return gradesStore.grades
    .filter(g => g.studentId === props.studentId)
    .map(g => {
      const test = testsStore.tests.find(t => t.id === g.testId);
      const maxPoints = test?.maxPoints ?? 100;
      const requiredPoints = test?.requiredPoints ?? 0;
      const percentage = round2((g.points / maxPoints) * 100);
      const status = g.points >= requiredPoints;
      return {
        testName: test?.name ?? 'Unknown Test',
        points: g.points,
        percentage,
        maxPoints,
        status
      };
    });
});

</script>

<template>
  <h1 class="sr-only">Register - Student Details</h1>
  <h2 class="title-section">Student details</h2>
  <div class="cards-section">
    <div v-if="student" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <PersonalData :name="student.name" :surname="student.surname" :gender="student.gender" 
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ActionsStudent :student="student" :final-grade="finalGrade" :grades-stats="gradeStats" 
      :individual-performance="individualPerformace" :class-performance="classPerformace"
      :results="results" :pass-rate="passRate"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-1 lg:row-start-2"/>
      <FinalGradeResult :student-id="studentId" :final-grade="finalGrade" :gradesStats="gradeStats"
      class="
      lg:row-span-2 lg:col-start-3 lg:row-start-1"/>
      <StudentPassRate :student-id="student.id" :pass-rate="passRate" 
      class="
      lg:row-span-2 lg:col-start-4 lg:row-start-1"/>
      <StudentPerformance :individual-performance="individualPerformace" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-3"/>
      <ComparisionClass :individual-data="individualPerformace" :class-data="classPerformace" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-3"/>
      <StudentResults :student-id="student.id" :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-4"/>
      <StudentResultsDatatable :student-id="student.id" :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-4"/>
    </div>
  </div>
  
</template>