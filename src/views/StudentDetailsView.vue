<script setup lang="ts">
  import ComparisionClass from '@/components/studentDetails/ComparisionClass.vue';
  import FinalGradeResult from '@/components/studentDetails/FinalGradeResult.vue';
  import Performance from '@/components/studentDetails/Performance/Performance.vue';
  import PersonalData from '@/components/studentDetails/PersonalData.vue';
  import TestResults from '@/components/studentDetails/TestResults.vue';
  import TestsTaken from '@/components/studentDetails/TestsTaken.vue';
  import type { Student } from '@/models/Student';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { getClassMax, getClassMedian, getClassMin, getClassStandardDeviation, getClassWeightedAverage, getStudentMax, getStudentMedian, getStudentMin, getStudentStandardDeviation, getStudentWeightedAverage, round2 } from '@/utility/mathUtils';
  import { onMounted, ref } from 'vue';

  const props = defineProps<{ studentId: string }>();

  const registerStore = useRegisterStore();

  const student = ref<Student>();
  
  const individualPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
    weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
  });

  const classPerformace = ref<{weightedAverage: number; median: number; standardDeviation: number; min: number; max: number}>({
    weightedAverage: 0, median: 0, standardDeviation: 0, min: 0, max: 0
  });


  function loadStudentData() {
    const s = registerStore.getStudent(props.studentId);
    if (!s) return;

    student.value = s;
    const studentTests = registerStore.tests.filter(test =>
      registerStore.grades.some(g => g.studentId === props.studentId && g.testId === test.id)
    );

    individualPerformace.value = {
      weightedAverage: round2(getStudentWeightedAverage(registerStore.grades, studentTests, props.studentId)),
      median: round2(getStudentMedian(registerStore.grades, studentTests, props.studentId)),
      standardDeviation: round2(getStudentStandardDeviation(registerStore.grades, studentTests, props.studentId)),
      min: round2(getStudentMin(registerStore.grades, props.studentId, studentTests)),
      max: round2(getStudentMax(registerStore.grades, props.studentId, studentTests))
    };

    classPerformace.value = {
      weightedAverage: round2(getClassWeightedAverage(registerStore.grades, studentTests)),
      median: round2(getClassMedian(registerStore.grades, studentTests)),
      standardDeviation: round2(getClassStandardDeviation(registerStore.grades, studentTests)),
      min: round2(getClassMin(registerStore.grades, studentTests)),
      max: round2(getClassMax(registerStore.grades, studentTests))
    };
  }

  onMounted(() => {
    loadStudentData();
  });
</script>

<template>
  <h2 class="m-4">Student Details</h2>
  <div class="grid grid-cols-4 auto-rows-auto w-full">
    <PersonalData :name="student?.name ?? ''" :surname="student?.surname ?? ''" class="col-span-2"/>
    <FinalGradeResult class="col-start-3"/>
    <!-- <TestsTaken class="col-start-4"/> -->
    <Performance :individual-performance="individualPerformace" class="col-span-2 row-start-2"/>
    <ComparisionClass :individual-data="individualPerformace" :class-data="classPerformace" class="col-span-2 col-start-3 row-start-2"/>
    <TestResults :grades="registerStore.grades" :tests="registerStore.tests" class="col-span-2 row-start-3"/>
  </div>
</template>