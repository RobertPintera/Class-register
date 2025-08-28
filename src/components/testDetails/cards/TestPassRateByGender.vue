<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';

const studentsStore = useStudentsStore();
const gradesStore = useGradesStore();

const props = defineProps<{testId: string, requiredPoints: number | null}>();
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const genders = ['Male', 'Female'];

  const stats: Record<string, { passed: number; failed: number; notTaken: number }> = {};
  genders.forEach(g => (stats[g] = { passed: 0, failed: 0, notTaken: 0 }));

  studentsStore.students.forEach(student => {
    const grade = gradesStore.getGrade(student.id, props.testId);
    const gender = student.gender;

    if (!grade) {
      stats[gender].notTaken++;
    } else if (props.requiredPoints === null || grade.points >= props.requiredPoints) {
      stats[gender].passed++;
    } else {
      stats[gender].failed++;
    }
    
  });

  chartData.value = {
    labels: ["Passed","Failed","Not taken"],
    datasets: [
      {
        label: 'Male',
        data: [
          stats['Male'].passed,
          stats['Male'].failed,
          stats['Male'].notTaken,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Female',
        data: [
          stats['Female'].passed,
          stats['Female'].failed,
          stats['Female'].notTaken,
        ],
        backgroundColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: 'rgb(6, 182, 212)',
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
        position: 'top',
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
      <h3>Test pass rate by gender</h3>
    </template>
    <template #body>
      <div class="relative w-full h-[90%]">
        <Chart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full max-h-[360px]"
        />
      </div>
    </template>
  </Card>
</template>