<script setup lang="ts">
import type { Grade } from '@/models/Grade';
import type { Test } from '@/models/Test';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';

const registerStore = useRegisterStore();
const props = defineProps<{ studentId: string }>();
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  let passed = 0;
  let failed = 0;
  let notTakenMandatory = 0;
  let notTakenOptional = 0;

  registerStore.tests.forEach(test => {
    const grade = registerStore.getGrade(props.studentId, test.id);

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

  return {
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
  return {
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
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
};

onMounted(updateChart);

</script>

<template>
  <Card>
    <template #header>
      <h3>Tests Taken</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="doughnut"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
      </div>
    </template>
  </Card>
</template>
