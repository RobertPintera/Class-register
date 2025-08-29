<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from '@/components/core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { getStudentWeightedAverage } from '@/utility/mathUtils';
import { getStudentFinalGrade } from '@/utility/gradeUtils';
import { useTestsStore } from '@/stores/useTestsStore';
import { useGradesStore } from '@/stores/useGradesStore';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { useStudentsStore } from '@/stores/useStudentsStore';

const studentsStore = useStudentsStore();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();
const gradeThresholdsStore = useGradeThresholdsStore();

const props = defineProps<{studentId: string}>();

const bestGrade = ref<string>(getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, props.studentId));

const stats = computed(() => {
  const students = studentsStore.students;
  const total = students.length || 1;
  
  const higher = (students.filter(s => {
    const grade = getStudentFinalGrade(gradesStore.grades, testsStore.tests, gradeThresholdsStore.gradeThresholds, s.id);
    return grade > bestGrade.value; 
  }).length / total) * 100;
  const lower = 100 - higher;

  return [
    { label: 'Lower or equal', color: '#60a5fa', value: parseFloat(lower.toFixed(1)) },
    { label: 'Higher', color: "#fbbf24", value: parseFloat(higher.toFixed(1)) }
  ];
});

</script>

<template>
  <Card class="flex flex-col">
    <template #header>
      <h3>Final Grade</h3>
    </template>
    <template #body>
      <div class="flex-1 flex justify-center items-center">
        <h4 class="text-[clamp(1rem,5vw,4rem)] leading-none">
          {{ bestGrade }}
        </h4>
      </div>
      <div class="mt-auto">
        <p class="text-center my-2">Compared to other students' grades</p>
        <MeterGroup :value="stats" />
      </div>
    </template>
  </Card>
</template>