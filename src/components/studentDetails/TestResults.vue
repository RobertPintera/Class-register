<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import { computed, onMounted, ref } from 'vue';

const registerStore = useRegisterStore();

const chartData = ref();
const chartOptions = ref();

const studentScores = computed(() => {
  return registerStore.grades
    .map(grade => {
      const test = registerStore.tests.find(t => t.id === grade.testId);
      if (!test) return null;
      return { testName: test.name, score: grade.score };
    })
    .filter((item): item is { testName: string; score: number } => item !== null);
});

const setChartData = () => {
  const labels = studentScores.value.map(t => t.testName);
  const data = studentScores.value.map(t => t.score);

  return {
    labels,
    datasets: [
      {
        label: 'Score',
        data: data,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };
};

const setChartOptions = () => {
  return {
    indexAxis: 'y',
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
   <div class="card flex-1 min-w-64 h-fit">
    <h3>Test Results</h3>
    <div class="relative w-full h-[400px]">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full"/>
    </div>
  </div>
</template>