<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import type { TestResult } from '@/models/TestResult';

const props = defineProps<{ studentId: string, results: TestResult[]}>();

const getSeverity = (status: boolean): string => {
  if(status)
    return 'success';
  return 'warn';
};
</script>

<template>
  <Card>
    <template #header>
      <h3>Results - details</h3>
    </template>
    <template #body>
      <DataTable :value="props.results"
        scrollable removableSort paginator paginatorPosition="bottom" :rows=10>
        <Column field="testName" header="Test"/>
        <Column field="points" header="Score"/>
        <Column field="percentage" header="Normalized Score (%)">
          <template #body="{ data }">
            {{ data.percentage }}%
          </template>
        </Column>
        <Column field="maxPoints" header="Max Points"/>
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
    @apply min-h-[400px] h-[400px];
  }
</style>