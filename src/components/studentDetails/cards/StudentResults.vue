<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { TooltipItem } from 'chart.js';
import type { DatasetTestResults } from '@/models/DatasetTestResults';
import Card from '@/components/core/Card.vue';
import type { StudentResult } from '@/models/TestResult';

const props = defineProps<{ studentId: string, results: StudentResult[] }>();

const chartData = ref<{ labels: string[]; datasets: DatasetTestResults[] }>();
const chartOptions = ref();

const currentPage = ref(0);
const rowsPerPage = 4;
const totalRecords = ref(0);


const setChartData = () => {
  totalRecords.value = props.results.length;

  const start = currentPage.value * rowsPerPage;
  const end = start + rowsPerPage;
  const pageScores = props.results.slice(start, end);

  chartData.value = {
    labels: pageScores.map(t => t.testName),
    datasets: [
      {
        label: 'Score',
        data: pageScores.map(t => t.percentage),
        points: pageScores.map(t => t.points),
        maxPoints: pageScores.map(t => t.maxPoints),
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
            return `${dataset.points[index]} / ${dataset.maxPoints[index]} points (${ctx.formattedValue}%)`;
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
  <Card>
    <template #header>
      <h3>Results</h3>
    </template>
    <template #body>
      <div class="flex-1 min-w-64 h-fit">
        <div class="relative w-full h-[400px]">
          <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-full"/>
        </div>
        <Paginator :rows="rowsPerPage" :totalRecords="totalRecords" :page="currentPage" @page="onPageChange"/>
      </div>
    </template>
  </Card>
</template>