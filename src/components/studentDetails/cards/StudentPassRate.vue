<script setup lang="ts">
import { computed } from 'vue';
import Card from '@/components/core/Card.vue';
import type { DetailedPassRate } from '@/models/DetailedPassRate';

const props = defineProps<{ studentId: string, passRate: DetailedPassRate }>();

const chartData = computed(() => ({
  labels: ['Passed', 'Failed', 'Not Taken - Mandatory', 'Not Taken'],
  datasets: [
    {
      data: [props.passRate.passed, props.passRate.failed, props.passRate.notTakenMandatory, props.passRate.notTakenOptional],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',  
        'rgba(239, 68, 68, 0.6)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(156, 163, 175, 0.6)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(156, 163, 175)',
      ],
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      align: 'center',
      position: 'bottom',
      labels: {
        usePointStyle: true,
      },
    },
  },
  layout: {
    padding: 10,
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Pass rate</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full max-h-[360px]"
        />
      </div>
    </template>
  </Card>
</template>
