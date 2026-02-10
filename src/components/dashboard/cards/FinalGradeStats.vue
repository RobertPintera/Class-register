<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/core/Card.vue';
import type { GradeThreshold } from '@/models/GradeThreshold';

const props = defineProps<{ gradeThresholds: GradeThreshold[], countsMale: Record<string, number>, countsFemale: Record<string, number> }>();

const chartData = computed(() => ({
  labels: props.gradeThresholds.map(th => th.name),
  datasets: [
    {
      label: 'Male',
      data: props.gradeThresholds.map(th => props.countsMale[th.name] ?? 0),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    },
    {
      label: 'Female',
      data: props.gradeThresholds.map(th => props.countsFemale[th.name] ?? 0),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }
  ]
}));

const chartOptions =  {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Students number',
      },
      ticks: {
        stepSize: 1,
        callback: function(value: number | string) {
          return Number(value) % 1 === 0 ? value : null;
        }
      },
    },
    x: {
      title: {
        display: true,
        text: 'Grade',
      },
    },
  },
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Final grade stats</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
      </div>
    </template>
  </Card>
</template>