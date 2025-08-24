<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { getStudentWeightedAverage } from '@/utility/mathUtils';

const registerStore = useRegisterStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const { students, grades, tests, thresholds } = registerStore;

  const averages = registerStore.students.map(s => ({
    studentId: s.id,
    avg: getStudentWeightedAverage(grades, tests, s.id),
  }));

  const counts: Record<string, number> = {};
  for (const th of thresholds) {
    counts[th.name] = 0;
  }

  for (const a of averages) {
    const th = thresholds.slice()
      .sort((a, b) => b.minPercentage - a.minPercentage) 
      .find(th => a.avg >= th.minPercentage);

    if (th) counts[th.name]++;
  }

  return {
    labels: thresholds.map(th => th.name),
    datasets: [
      {
        label: 'Students',
        data: thresholds.map(th => counts[th.name]),
        backgroundColor: '#42A5F5',
      },
    ],
  };
};

const setChartOptions = () => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.parsed.y} studentów`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Liczba studentów',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Ocena',
        },
      },
    },
  };
};

const updateChart = () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
};

onMounted(() => {
  updateChart();
});

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