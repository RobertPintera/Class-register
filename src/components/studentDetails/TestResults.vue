<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import { computed, onMounted, ref } from 'vue';
import type { TooltipItem } from 'chart.js';
import type { DatasetTestResults } from '@/models/DatasetTestResults';

const registerStore = useRegisterStore();
const props = defineProps<{ studentId: string }>();

const chartData = ref<{ labels: string[]; datasets: DatasetTestResults[] }>();
const chartOptions = ref();

const currentPage = ref(0);
const rowsPerPage = 4;
const totalRecords = ref(0);


const setChartData = () => {
  const studentScores = registerStore.grades
    .filter(g => g.studentId === props.studentId)
    .map(g => {
      const test = registerStore.tests.find(t => t.id === g.testId);
      const max = test?.maxPoints ?? 100;
      return {
        testName: test?.name ?? 'Unknown Test',
        score: g.points,
        maxScore: max,
        percentage: (g.points / max) * 100
      };
    });

  totalRecords.value = studentScores.length;

  const start = currentPage.value * rowsPerPage;
  const end = start + rowsPerPage;
  const pageScores = studentScores.slice(start, end);

  chartData.value = {
    labels: pageScores.map(t => t.testName),
    datasets: [
      {
        label: 'Score',
        data: pageScores.map(t => t.percentage),
        originalScores: pageScores.map(t => t.score),
        maxScores: pageScores.map(t => t.maxScore),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };
};

const setChartOptions = () => {
  chartOptions.value = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) => {
            const dataset = ctx.dataset as DatasetTestResults;
            const index = ctx.dataIndex;
            return `${dataset.originalScores[index]} / ${dataset.maxScores[index]} points (${ctx.formattedValue}%)`;
          },
        },
      },
    },
    scales: {
      x: { min: 0, max: 100 },
    },
  };
};

const updateChart = () => {
  setChartData();
  setChartOptions();
};

onMounted(() => {
  updateChart();
});

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page;
  setChartData();
};
</script>

<template>
   <div class="card flex-1 min-w-64 h-fit">
    <h3>Test Results</h3>
    <div class="relative w-full h-[400px]">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full"/>
    </div>
    <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :page="currentPage" @page="onPageChange"/>
  </div>
</template>