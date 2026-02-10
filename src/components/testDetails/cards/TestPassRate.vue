<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Card from '@/components/core/Card.vue';
import type { PassRate } from '@/models/PassRate';

const props = defineProps<{passRate: PassRate}>();

const chartData = computed(() => ({
  labels: ["Passed", "Failed", "Not Taken"],
  datasets: [
    {
      data: [props.passRate.passed, props.passRate.failed, props.passRate.notTaken],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',  
        'rgba(239, 68, 68, 0.6)',
        'rgba(156, 163, 175, 0.6)',
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)',
        'rgb(156, 163, 175)',
      ],
      borderWidth: 1,
    },
  ]
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
      <h3>Pass Rate</h3>
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