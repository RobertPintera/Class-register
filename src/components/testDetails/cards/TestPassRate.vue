<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useGradesStore } from '@/stores/useGradesStore';

const studentsStore = useStudentsStore();
const gradesStore = useGradesStore();

const props = defineProps<{testId: string, requiredPoints: number | null}>();
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  let passed = 0;
  let failed = 0;
  let notTaken = 0;

  studentsStore.students.filter(student => {
    const grade = gradesStore.getGrade(student.id, props.testId);

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
          class="w-full h-full max-h-[360px]"
        />
      </div>
    </template>
  </Card>
</template>