<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { getTestNormalizedAverageByGender } from '@/utility/mathUtils';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useGradesStore } from '@/stores/useGradesStore';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const tests = testsStore.tests;
  const students = studentsStore.students;
  const grades = gradesStore.grades;

  const maleScores: number[] = [];
  const femaleScores: number[] = [];

  tests.forEach(t => {
    maleScores.push(getTestNormalizedAverageByGender(grades, students, t, "Male"));
    femaleScores.push(getTestNormalizedAverageByGender(grades, students, t, "Female"))
  });

  chartData.value = {
    labels: tests.map(t => t.name),
    datasets: [
      {
        label: 'Male',
        data: maleScores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
      },
      {
        label: 'Female',
        data: femaleScores,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
      },
    ]
  };
};

const setChartOptions = () => {
  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 100,
      }
    }
  };
};

const updateChart = () => {
  setChartData();
  setChartOptions();
};

onMounted(updateChart);

</script>

<template>
  <Card>
    <template #header>
      <h3>Test comparision</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="radar"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
      </div>
    </template>
  </Card>
</template>