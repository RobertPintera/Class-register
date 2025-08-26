<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useGradesStore } from '@/stores/useGradesStore';
import { useTestsStore } from '@/stores/useTestsStore';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  let passed = 0;
  let failed = 0;
  let notTakenMandatory = 0;
  let notTakenOptional = 0;

  testsStore.tests.forEach(test => {
    studentsStore.students.forEach(student => {
      const grade = gradesStore.getGrade(student.id, test.id);

      if (!grade) {
        if (test.isMandatory) {
          notTakenMandatory++;
        } else {
          notTakenOptional++;
        }
      } else if (!test.requiredPoints || grade.points >= test.requiredPoints) {
        passed++;
      } else {
        failed++;
      }
    });
  });

  chartData.value = {
    labels: ['Passed', 'Failed', 'Not Taken - Mandatory', 'Not Taken'],
    datasets: [
      {
        data: [passed, failed, notTakenMandatory, notTakenOptional],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',  
          'rgba(239, 68, 68, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(156, 163, 175, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(234, 179, 8)',
          'rgb(156, 163, 175)',
        ],
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
      legend: {
        align: 'center',
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
    layout: {
      padding: 10,
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
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
      <h3>Class pass rate</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full max-h-[390px]"
        />
      </div>
    </template>
  </Card>
</template>