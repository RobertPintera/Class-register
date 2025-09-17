<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import { useTestsStore } from '@/stores/useTestsStore';
import { getTestAverageByGender, getTestNormalizedAverageByGender, round2 } from '@/utility/mathUtils';
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

  const maleNormalizedScores: number[] = [];
  const femaleNormalizedScores: number[] = [];
  const maleScores: number[] = [];
  const femaleScores: number[] = [];

  tests.forEach(t => {
    maleNormalizedScores.push(round2(getTestNormalizedAverageByGender(grades, students, t, "Male")));
    femaleNormalizedScores.push(round2(getTestNormalizedAverageByGender(grades, students, t, "Female")));
    maleScores.push(round2(getTestAverageByGender(grades, students, t.id, "Male")));
    femaleScores.push(round2(getTestAverageByGender(grades, students, t.id, "Female")));
  });

  chartData.value = {
    labels: tests.map(t => t.name),
    datasets: [
      {
        label: 'Male',
        data: maleNormalizedScores,
        rawData: maleScores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
      },
      {
        label: 'Female',
        data: femaleNormalizedScores,
        rawData: femaleScores,
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
        min: 0,
        max: 100,
        ticks: {
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const dataset = ctx.dataset;
            const normalizedValue = ctx.formattedValue;
            const value = dataset.rawData[ctx.dataIndex];
            return `${dataset.label}: ${value} (${normalizedValue}%)`;
          }
        }
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