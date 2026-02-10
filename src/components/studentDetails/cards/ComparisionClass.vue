<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import type { PerformanceStats } from '@/models/PerformanceStats';

const props = defineProps<{
  individualData: PerformanceStats;
  classData: PerformanceStats;
}>();

const chartData = ref();
const chartOptions = ref();


const setChartData = () => {
  return {
    labels: ['Weighted Average', 'Median', 'Standard Deviation', 'Min', 'Max'],
    datasets: [
      {
        label: 'Individual',
        data: [
          props.individualData.weightedAverage,
          props.individualData.median,
          props.individualData.standardDeviation,
          props.individualData.min,
          props.individualData.max
        ],
        backgroundColor: 'rgba(101, 219, 144, 0.6)',
        borderColor: 'rgb(101, 219, 144)',
        borderWidth: 1
      },
      {
        label: "Class",
        data: [
          props.classData.weightedAverage,
          props.classData.median,
          props.classData.standardDeviation,
          props.classData.min,
          props.classData.max
        ],
        backgroundColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: 'rgb(6, 182, 212)',
        borderWidth: 1
      }
    ]
  };
};

const setChartOptions = () => {
  return {
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
        max: 100,
      },
    },
  };
};

const updateChart = () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
};

onMounted(updateChart);
</script>

<template>
  <Card>
    <template #header>
      <h3>Class comparison</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full" />
      </div>
    </template>
  </Card>
</template>