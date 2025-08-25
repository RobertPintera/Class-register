<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useTestsStore } from '@/stores/useTestsStore';

const testsStore = useTestsStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  let mandatory = 0;
  let optional = 0;

  testsStore.tests.forEach(test => {
    if (test.isMandatory) {
      mandatory++;
    } else {
      optional++;
    }
  });

  chartData.value = {
    labels: ['Mandatory', 'Optional'],
    datasets: [
      {
        data: [mandatory, optional],
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
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
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
      <h3>Mandatory Tests Count</h3>
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