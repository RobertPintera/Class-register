<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { getStudentWeightedAverage } from '@/utility/mathUtils';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { useTestsStore } from '@/stores/useTestsStore';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const students = studentsStore.students;
  const tests = testsStore.tests;
  const grades = gradesStore.grades;
  const gradeThresholds = gradeThresholdsStore.gradeThresholds;

  const averages = students.map(s => ({
    studentId: s.id,
    avg: getStudentWeightedAverage(grades, tests, s.id),
  }));

  const counts: Record<string, number> = {};
  for (const th of gradeThresholds) {
    counts[th.name] = 0;
  }

  for (const a of averages) {
    const th = gradeThresholds.slice()
      .sort((a, b) => b.minPercentage - a.minPercentage) 
      .find(th => a.avg >= th.minPercentage);

    if (th) counts[th.name]++;
  }

  return {
    labels: gradeThresholds.map(th => th.name),
    datasets: [
      {
        label: 'Students',
        data: gradeThresholds.map(th => counts[th.name]),
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
          label: (ctx: any) => `${ctx.parsed.y} students`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Students number',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Grade',
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
      <h3>Final grade stats</h3>
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