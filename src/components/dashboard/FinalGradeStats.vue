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
  const gradeThresholds = gradeThresholdsStore.gradeThresholds.slice().sort((a, b) => a.minPercentage - b.minPercentage);

  const countsMale: Record<string, number> = {};
  const countsFemale: Record<string, number> = {};
  gradeThresholds.forEach(th => {
    countsMale[th.name] = 0;
    countsFemale[th.name] = 0;
  });

  for (const s of students) {
    const average = getStudentWeightedAverage(grades, tests, s.id);
    const th = gradeThresholds.slice()
      .sort((a, b) => b.minPercentage - a.minPercentage)
      .find(th => average >= th.minPercentage);

    if (!th) continue;

    if (s.gender === 'Male')
      countsMale[th.name]++;
    else if (s.gender === 'Female') 
      countsFemale[th.name]++;
  }

  chartData.value =  {
    labels: gradeThresholds.map(th => th.name),
    datasets: [
      {
        label: 'Male',
        data: gradeThresholds.map(th => countsMale[th.name]),
        backgroundColor: '#42A5F5',
      },
      {
        label: 'Female',
        data: gradeThresholds.map(th => countsFemale[th.name]),
        backgroundColor: '#FF6384',
      },
    ],
  };
};

const setChartOptions = () => {
  chartOptions.value =  {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
  setChartData();
  setChartOptions();
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