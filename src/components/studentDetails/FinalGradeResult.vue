<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { getStudentFinalGrade, getStudentWeightedAverage } from '@/utility/mathUtils';

const registerStore = useRegisterStore();
const props = defineProps<{weightedAverage: number}>();

const bestGrade = ref<string>(getStudentFinalGrade(props.weightedAverage, registerStore.thresholds))

const stats = computed(() => {
  const students = registerStore.students;
  const total = students.length || 1;
  
  const higher = (students.filter(s => {
    const average = getStudentWeightedAverage(registerStore.grades, registerStore.tests, s.id);
    const grade = getStudentFinalGrade(average, registerStore.thresholds);
    return grade > bestGrade.value; 
  }).length / total) * 100;
  const lower = 100 - higher;

  return [
    { label: 'Lower or equal', color: '#60a5fa', value: parseFloat(lower.toFixed(1)) },
    { label: 'Higher', color: "#fbbf24", value: parseFloat(higher.toFixed(1)) }
  ];
});

</script>

<template>
  <Card class="flex flex-col">
    <template #header>
      <h3>Final Grade</h3>
    </template>
    <template #body>
      <div class="flex-1 flex justify-center items-center">
        <h4 class="text-[clamp(1rem,5vw,4rem)] leading-none">
          {{ bestGrade }}
        </h4>
      </div>
      <div class="mt-auto">
        <p class="text-center my-2">Compared to other students' grades</p>
        <MeterGroup :value="stats" />
      </div>
    </template>
  </Card>
</template>