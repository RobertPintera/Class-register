<script setup lang="ts">
import { computed } from 'vue';
import { round2 } from '@/utility/mathUtils';
import { useGradesStore } from '@/stores/useGradesStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import Card from '@/components/core/Card.vue';

const studentsStore = useStudentsStore();
const gradesStore = useGradesStore();

const props = defineProps<{ testId: string, requiredPoints: number | null, maxPoints: number }>();

const tableData = computed(() => {
  return gradesStore.grades
    .filter(g => g.testId === props.testId)
    .map(g => {
      const student = studentsStore.students.find(s => s.id === g.studentId);
      if (!student) return null;

      const percentage = round2((g.points / props.maxPoints) * 100);
      const status = props.requiredPoints !== null ? g.points >= props.requiredPoints : false;
      return {
        name: student.name,
        surname: student.surname,
        points: g.points,
        percentage: percentage,
        status: status
      };
    });
});

const getSeverity = (status: boolean): string => {
  if(status)
    return 'success';
  return 'warn';
};
</script>

<template>
  <Card>
    <template #header>
      <h3>Test Results - Data Table</h3>
    </template>
    <template #body>
      <DataTable :value="tableData"
        scrollable removableSort paginator paginatorPosition="bottom" :rows=10>
        <Column field="name" header="Name">
        </Column>
        <Column field="surname" header="Surname">
        </Column>
        <Column field="points" header="Score">
        </Column>
        <Column field="percentage" header="Normalized Score (%)">
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
              <Tag :value="data.status ? 'passed' : 'failed'" :severity="getSeverity(data.status)" />
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>  
</template>

<style scoped>
  :deep(.p-datatable-table-container)	{
    @apply max-h-[450px];
  }
</style>