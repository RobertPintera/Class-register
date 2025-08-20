<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import Card from '../core/Card.vue';
import { computed } from 'vue';
import { round2 } from '@/utility/mathUtils';

const registerStore = useRegisterStore();
const props = defineProps<{ studentId: string }>();

const tableData = computed(() => {
  return registerStore.grades
    .filter(g => g.studentId === props.studentId)
    .map(g => {
      const test = registerStore.tests.find(t => t.id === g.testId);
      if (!test) return null;
      const maxPoints = test.maxPoints;
      const requiredPoints = test.requiredPoints ?? 0;
      const percentage = round2((g.points / maxPoints) * 100);
      const status = g.points >= requiredPoints;
      return {
        testName: test?.name ?? 'Unknown Test',
        points: g.points,
        percentage,
        maxPoints,
        status
      };
    });
});


const getSeverity = (status: boolean): string => {
  if(status)
    return 'success';
  return 'warn';
}
</script>

<template>
  <Card>
    <template #header>
      <h3>Test Results - Data Table</h3>
    </template>
    <template #body>
      <DataTable :value="tableData"
        scrollable removableSort paginator paginatorPosition="bottom" :rows=10>
        <Column field="testName" header="Test">
        </Column>
        <Column field="points" header="Score">
        </Column>
        <Column field="percentage" header="Normalized Score (%)">
        </Column>
        <Column field="maxPoints" header="Max Points">
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
              <Tag :value="data.status ? 'pass' : 'failed'" :severity="getSeverity(data.status)" />
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