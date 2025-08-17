<script setup lang="ts">
import { computed } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';

const registerStore = useRegisterStore();
const props = defineProps<{weightedAverage: number}>();

const bestGrade = computed(() => {
  return registerStore.thresholds
    // keep only thresholds that are achieved
    .filter(t => props.weightedAverage >= t.minPercentage)
    // sort descending by minPercentage and take the first
    .sort((a, b) => b.minPercentage - a.minPercentage)[0]?.name ?? '—';
});

const stats = computed(() => {
  const students = registerStore.students ?? [];
  const total = students.length || 1;

  const higher = (students.filter(s => s.weightedAverage > props.weightedAverage).length / total) * 100;
  const lower = (students.filter(s => s.weightedAverage <= props.weightedAverage).length / total) * 100;

  return [
    { label: 'Higher', color: "#fbbf24", value: parseFloat(higher.toFixed(1)) },
    { label: 'Lower or equal', color: '#60a5fa', value: parseFloat(lower.toFixed(1)) }
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
        <p class="text-center my-2">Compared to other students' averages</p>
        <MeterGroup :value="stats" />
      </div>
    </template>
  </Card>
</template>