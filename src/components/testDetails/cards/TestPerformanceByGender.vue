<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Card from '@/components/core/Card.vue';
import type { PerformanceStats } from '@/models/PerformanceStats';

const props = defineProps<{
  maleData: PerformanceStats;
  femaleData: PerformanceStats;
}>();

const chartData = computed(() => ({
  labels: ['Weighted Average', 'Median', 'Standard Deviation', 'Min', 'Max'],
  datasets: [
    {
      label: 'Male',
      data: [
        props.maleData.weightedAverage,
        props.maleData.median,
        props.maleData.standardDeviation,
        props.maleData.min,
        props.maleData.max
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    },
    {
      label: 'Female',
      data: [
        props.femaleData.weightedAverage,
        props.femaleData.median,
        props.femaleData.standardDeviation,
        props.femaleData.min,
        props.femaleData.max
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      min: 0,
    },
  },
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Performance by gender</h3>
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