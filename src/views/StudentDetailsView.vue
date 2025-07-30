<script setup lang="ts">
  import type { Student } from '@/models/Student';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { getStudentMedian, getStudentStandardDeviation, getStudentWeightedAverage } from '@/utility/mathUtils';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';

  const registerStore = useRegisterStore();

  const route = useRoute();
  const student = ref<Student>();
  const studentId = route.params.studentId as string;

  const individualPerformace = ref<{
    weightedAverage: number;
    median: number;
    standardDeviation: number;
  }>({
    weightedAverage: 0,
    median: 0,
    standardDeviation: 0
  });

  onMounted(() => {
    student.value = registerStore.getStudent(studentId);
    individualPerformace.value = {
      weightedAverage: getStudentWeightedAverage(registerStore.grades, registerStore.tests, studentId),
      median: getStudentMedian(registerStore.grades, registerStore.tests, studentId),
      standardDeviation: getStudentStandardDeviation(registerStore.grades, registerStore.tests, studentId),
    };
  });


</script>

<template>
  <h2 class="m-4">Student Details</h2>
  <div class="flex w-full flex-wrap">
    <div class="flex flex-col flex-1">
      <div class="card">
        <h3>Personal Data</h3>
        <h5>Name: {{ student?.name }}</h5>
        <h5>Surname: {{ student?.surname }}</h5>
      </div>
      <div class="card">
        <h3>Performance</h3>
        <div class="flex justify-evenly flex-wrap gap-4 mt-2">
          <div class="flex flex-col justify-center items-center w-fit">
            <h4>Weighted Average</h4>
            <Knob v-model="individualPerformace.weightedAverage" :size="200" readonly/>
          </div>
          <div class="flex flex-col justify-center items-center w-fit">
            <h4>Median</h4>
            <Knob v-model="individualPerformace.median" :size="200" readonly/>
          </div>
          <div class="flex flex-col justify-center items-center w-fit">
            <h4>Standard Deviation</h4>
            <Knob v-model="individualPerformace.standardDeviation" :size="200" readonly/>
          </div>
        </div>
      </div>
    </div>
    <div class="card flex-1">
      
    </div>
  </div>
  
</template>