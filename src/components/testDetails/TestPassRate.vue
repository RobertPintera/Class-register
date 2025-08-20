<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '../core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';

const registerStore = useRegisterStore();

const props = defineProps<{testId: string, requiredPoints: number | null}>();
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  let passed = 0;
  let failed = 0;
  let notTaken = 0;

  registerStore.students.filter(student => {
    const grade = registerStore.getGrade(student.id, props.testId);

    if (!grade) {
      notTaken++;
    } else if (props.requiredPoints === null || grade.points >= props.requiredPoints) {
      passed++;
    } else {
      failed++;
    }
  });

  return {
    labels: ["Passed", "Failed", "Not Taken"],
    datasets: [
      {
        data: [passed, failed, notTaken],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',  
          'rgba(239, 68, 68, 0.6)',
          'rgba(156, 163, 175, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      },
    ]
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

onMounted(() => {
  updateChart();
});

</script>

<template>
  <Card>
    <template #header>
      <h3>Test Pass Rate</h3>
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