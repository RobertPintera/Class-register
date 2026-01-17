<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import { getStudentWeightedAverage } from '@/utility/mathUtils';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { useTestsStore } from '@/stores/useTestsStore';
import { getStudentFinalGrade } from '@/utility/gradeUtils';
import { useSettingsStore } from '@/stores/useSettingsStore';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();
const settingsStore = useSettingsStore();

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const students = studentsStore.students;
  const tests = testsStore.tests;
  const grades = gradesStore.grades;
  const gradeThresholds = gradeThresholdsStore.gradeThresholds.slice().sort((a, b) => a.minPercentage - b.minPercentage);
  const settings = settingsStore.settings ?? {id: 'global', editWithDialog: true, frozenStudentInGrades: true, lowestGradeForTestMandatory: false, lowestGradeForTestFailed: false};

  const countsMale: Record<string, number> = {};
  const countsFemale: Record<string, number> = {};
  gradeThresholds.forEach(th => {
    countsMale[th.name] = 0;
    countsFemale[th.name] = 0;
  });

  for (const student of students) {
    const grade = getStudentFinalGrade(grades, tests, gradeThresholds, settings, student.id);

    if (student.gender === 'Male')
      countsMale[grade.name]++;
    else if (student.gender === 'Female') 
      countsFemale[grade.name]++;
  }

  chartData.value =  {
    labels: gradeThresholds.map(th => th.name),
    datasets: [
      {
        label: 'Male',
        data: gradeThresholds.map(th => countsMale[th.name]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Female',
        data: gradeThresholds.map(th => countsFemale[th.name]),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      },
    ],
  };
};

const setChartOptions = () => {
  chartOptions.value =  {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Students number',
        },
        ticks: {
          stepSize: 1,
          callback: function(value: number | string) {
            return Number(value) % 1 === 0 ? value : null;
          }
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