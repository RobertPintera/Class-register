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
import type { Performance } from '@/models/Performance';
import type { StudentResult } from '@/models/TestResult';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();

const props = defineProps<{ studentId: string }>();
const student = ref<Student>();
const finalGrade = ref<GradeThreshold>({ id: "", name: "", minPercentage: 0});
const gradeStats = ref<GradeStats>({lowerValue: 0, higherValue: 100});
const individualPerformace = ref<Performance>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});
const classPerformace = ref<Performance>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});
const results = computed<StudentResult[]>(() => {
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

const loadData = () => {
  const s = studentsStore.getStudent(props.studentId);
  if (!s) return;

  const grades = gradesStore.grades;
  student.value = s;
  const studentTests = testsStore.tests.filter(test =>
    gradesStore.grades.some(g => g.studentId === props.studentId && g.testId === test.id)
  );

  individualPerformace.value = {
    weightedAverage: round2(getStudentWeightedAverage(grades, studentTests, props.studentId)),
    median: round2(getStudentMedian(grades, studentTests, props.studentId)),
    standardDeviation: round2(getStudentStandardDeviation(grades, studentTests, props.studentId)),
    min: round2(getStudentMin(grades, props.studentId, studentTests)),
    max: round2(getStudentMax(grades, props.studentId, studentTests))
  };

  classPerformace.value = {
    weightedAverage: round2(getClassWeightedAverage(grades, studentTests)),
    median: round2(getClassMedian(grades, studentTests)),
    standardDeviation: round2(getClassStandardDeviation(grades, studentTests)),
    min: round2(getClassMin(grades, studentTests)),
    max: round2(getClassMax(grades, studentTests))
  };

  finalGrade.value = getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, props.studentId);
  const studentGrade = finalGrade.value;

  if(studentGrade){
    const students = studentsStore.students;
    const total = students.length || 1;
    
    const higher = (students.filter(s => {
      const grade = getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, s.id);
      return grade.minPercentage > studentGrade.minPercentage; 
    }).length / total) * 100;
    const lower = 100 - higher;

    const lowerRounded = Math.round(lower);
    const higherRounded = 100 - lowerRounded;

    gradeStats.value = { 
      lowerValue: lowerRounded, 
      higherValue: higherRounded 
    };
  }
};


onMounted(() => {
  loadData();
});

watch(() => studentsStore.students,() => {
  const s = studentsStore.getStudent(props.studentId);
  if (!s) return;

  student.value = s;
}, { deep: true } );
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
      :results="results"
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-1 lg:row-start-2"/>
      <FinalGradeResult :student-id="studentId" :final-grade="finalGrade" :gradesStats="gradeStats"
      class="
      lg:row-span-2 lg:col-start-3 lg:row-start-1"/>
      <StudentPassRate :student-id="student.id" 
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