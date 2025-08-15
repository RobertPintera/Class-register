<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import { computed, onMounted, ref } from 'vue';
import type { TooltipItem } from 'chart.js';
import type { DatasetTestResults } from '@/models/DatasetTestResults';

const registerStore = useRegisterStore();
const props = defineProps<{ studentId: string }>();

const chartData = ref();
const chartOptions = ref();

const setChartData = () : { labels: string[]; datasets: DatasetTestResults[] } => {
  const studentScores = registerStore.grades
    .filter(g => g.studentId === props.studentId)
    .map(g => {
      const test = registerStore.tests.find(t => t.id === g.testId);
      const max = test?.maxScore ?? 100;
      return {
        testName: test?.name ?? 'Unknown Test',
        score: g.score,
        maxScore: max,
        percentage: (g.score / max) * 100
      };
    });

  return {
    labels: studentScores.map(t => t.testName),
    datasets: [
      {
        label: 'Score',
        data: studentScores.map(t => t.percentage),
        originalScores: studentScores.map(t => t.score),
        maxScores: studentScores.map(t => t.maxScore),
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
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const dataset = ctx.dataset as DatasetTestResults;
            const index = ctx.dataIndex;
            return `${dataset.originalScores[index]} / ${dataset.maxScores[index]} points (${ctx.formattedValue}%)`;
          }
        }
      }
    },
    scales: {
      x: {
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