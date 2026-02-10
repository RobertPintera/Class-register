<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/core/Card.vue';
import { getTestAverageByGender, getTestNormalizedAverageByGender, round2 } from '@/utility/mathUtils';
import type { Grade } from '@/models/Grade';
import type { Student } from '@/models/Student';
import type { Test } from '@/models/Test';

const props = defineProps<{ tests: Test[], students: Student[] ,grades: Grade[]}>();

const chartData = computed(() => {
  const maleNormalizedScores: number[] = [];
  const femaleNormalizedScores: number[] = [];
  const maleScores: number[] = [];
  const femaleScores: number[] = [];

  props.tests.forEach(t => {
    maleNormalizedScores.push(round2(getTestNormalizedAverageByGender(props.grades, props.students, t, "Male")));
    femaleNormalizedScores.push(round2(getTestNormalizedAverageByGender(props.grades, props.students, t, "Female")));
    maleScores.push(round2(getTestAverageByGender(props.grades, props.students, t.id, "Male")));
    femaleScores.push(round2(getTestAverageByGender(props.grades, props.students, t.id, "Female")));
  });

  return {
    labels: props.tests.map(t => t.name),
    datasets: [
      {
        label: 'Male',
        data: maleNormalizedScores,
        rawData: maleScores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
      },
      {
        label: 'Female',
        data: femaleNormalizedScores,
        rawData: femaleScores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
      },
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: {
        backdropColor: 'transparent'
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const dataset = ctx.dataset;
          const normalizedValue = ctx.formattedValue;
          const value = dataset.rawData[ctx.dataIndex];
          return `${dataset.label}: ${value} (${normalizedValue}%)`;
        }
      }
    }
  }
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Test comparision</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="radar"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
      </div>
    </template>
  </Card>
</template>