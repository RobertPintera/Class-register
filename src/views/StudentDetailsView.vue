<script setup lang="ts">
import ActionsStudent from '@/components/studentDetails/ActionsStudent.vue';
import ComparisionClass from '@/components/studentDetails/ComparisionClass.vue';
import FinalGradeResult from '@/components/studentDetails/FinalGradeResult.vue';
import Performance from '@/components/studentDetails/Performance.vue';
import PersonalData from '@/components/studentDetails/PersonalData.vue';
import StudentResults from '@/components/studentDetails/StudentResults.vue';
import StudentResultsDatatable from '@/components/studentDetails/StudentResultsDatatable.vue';
import StudentPassRate from '@/components/studentDetails/StudentPassRate.vue';
import type { Student } from '@/models/Student';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getClassMax, getClassMedian, getClassMin, getClassStandardDeviation, getClassWeightedAverage, getStudentMax, getStudentMedian, getStudentMin, getStudentStandardDeviation, getStudentWeightedAverage, round2 } from '@/utility/mathUtils';
import { onMounted, ref, watch } from 'vue';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const props = defineProps<{ studentId: string }>();
const student = ref<Student>();

const individualPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const classPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
  weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
});

const loadStudentData = () => {
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
};

onMounted(() => {
  loadStudentData();
});

watch(() => studentsStore.students,() => {
  const s = studentsStore.getStudent(props.studentId);
  if (!s) return;

  student.value = s;
}, { deep: true } );
</script>

<template>
  <h2 class="title-section">Student Details</h2>
  <div class="cards-section">
    <div v-if="student" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto w-full">
      <PersonalData :name="student.name" :surname="student.surname" :gender="student.gender" 
      class="
      sm:col-span-2
      lg:col-span-2"/>
      <ActionsStudent :student-id="studentId" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-1 lg:row-start-2"/>
      <FinalGradeResult :student-id="studentId"
      class="
      lg:row-span-2 lg:col-start-3 lg:row-start-1"/>
      <StudentPassRate :student-id="student.id" 
      class="
      lg:row-span-2 lg:col-start-4 lg:row-start-1"/>
      <Performance :individual-performance="individualPerformace" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-3"/>
      <ComparisionClass :individual-data="individualPerformace" :class-data="classPerformace" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-3"/>
      <StudentResults :student-id="student.id" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:row-start-4"/>
      <StudentResultsDatatable :student-id="student.id" 
      class="
      sm:col-span-2
      lg:col-span-2 lg:col-start-3 lg:row-start-4"/>
    </div>
  </div>
  
</template>