<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';

const registerStore = useRegisterStore();
const props = defineProps<{ testId: string, maxScore: number }>();

const chartData = ref();
const chartOptions = ref();

const currentPage = ref(0);
const rowsPerPage = 4;
const totalRecords = ref(0);


const setChartData = () => {
  const testScores = registerStore.grades
    .filter(g => g.testId === props.testId)
    .map(g => {
      const student = registerStore.students.find(t => t.id === g.studentId);
      return {
        name: student?.name,
        surname: student?.surname,
        score: g.points,
        percentage: (g.points / props.maxScore) * 100
      };
    });

  totalRecords.value = testScores.length;

  const start = currentPage.value * rowsPerPage;
  const end = start + rowsPerPage;
  const pageScores = testScores.slice(start, end);

  chartData.value = {
    labels: pageScores.map(t => `${t.name} ${t.surname}`),
    datasets: [
      {
        label: 'Score',
        data: pageScores.map(t => t.percentage),
        scores: pageScores.map(t => t.score),
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
          label: (ctx: any) => {
            const dataset = ctx.dataset;
            const index = ctx.dataIndex;
            return `${dataset.scores[index]} / ${props.maxScore} points (${ctx.formattedValue}%)`;
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
      <h3>Test Results</h3>
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