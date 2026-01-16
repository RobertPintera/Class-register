<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/core/Card.vue';
import type { GradeThreshold } from '@/models/GradeThreshold';
import type { GradeStats } from '@/models/GradeStats';

const props = defineProps<{studentId: string, finalGrade: GradeThreshold, gradesStats: GradeStats}>();

const stats = computed(() => {
  return [
    { label: 'Lower or equal', color: '#60a5fa', value: props.gradesStats.lowerValue },
    { label: 'Higher', color: "#fbbf24", value: props.gradesStats.higherValue }
  ];
});

</script>

<template>
  <Card class="flex flex-col">
    <template #header>
      <h3>Final grade</h3>
    </template>
    <template #body>
      <div class="flex-1 flex justify-center items-center">
        <h4 class="text-[clamp(1rem,5vw,4rem)] leading-none">
          {{ props.finalGrade.name }}
        </h4>
      </div>
      <div class="mt-auto">
        <p class="text-center my-2">Compared to other students' grades</p>
        <MeterGroup :value="stats" />
      </div>
    </template>
  </Card>
</template>