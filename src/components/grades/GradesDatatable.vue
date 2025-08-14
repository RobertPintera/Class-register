<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import EditGradeView from '@/components/grades/EditGradeView.vue';
import { onMounted, ref, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { Grade } from '@/models/Grade';
import type { AdvancedFilter } from '@/models/AdvancedFilter';

const registerStore = useRegisterStore();

const dialogVisible = ref(false);
const filters = ref<Record<string, AdvancedFilter>>({});

const initFilters = () =>  {
  filters.value = {
    fullName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]},
  };

  for (const col of registerStore.testColumns) {
    if (!filters.value[col.field]) {
      filters.value[col.field] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
    }
  }
};

initFilters();

watch(() => registerStore.testColumns, (columns) => {
  const columnFields = columns.map(c => c.field);

  for (const col of columns) {
    if (!filters.value[col.field]) {
      filters.value[col.field] = {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      };
    }
  }

  for (const key in filters.value) {
    if (key !== 'fullName' && !columnFields.includes(key)) {
      delete filters.value[key];
    }
  }
}, { immediate: true });

const clearFilter = () => {
  initFilters();
};

const editingGrade = ref<Pick<Grade, 'studentId' | 'testId'> | null>(null);

const onCellClick = (studentId: string, testId: string) => {
  editingGrade.value = { studentId, testId };
  dialogVisible.value = true;
};    
</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" editMode="cell" showGridlines class="custom-table" 
    scrollable removableSort paginator paginatorPosition="bottom" :rows=10
    :filters="filters" filterDisplay="menu">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
        <ButtonGroup>
          <Button label="Export" icon="pi pi-file-export" />
          <Button label="Import" icon="pi pi-file-import" />
        </ButtonGroup>
      </div>
    </template>
    <template #empty>
      <div class="w-full h-full px-3 py-4">
        No students found.
      </div>
    </template>
    <Column sortable field="fullName" header="Student" filterField="fullName" frozen>
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4 hover:bg-primary-select transition">
          {{ data.fullName }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by FullName" />
      </template>
    </Column>
    <Column sortable
      v-for="col in registerStore.testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header" :filterField="col.field" dataType="numeric">
      <template #body="{ data }">
         <div
          class="w-full h-full cursor-pointer px-3 py-4 hover:bg-primary-select transition"
          @click="onCellClick(data.studentId, col.field)">
          {{ registerStore.getGrade(data.studentId, col.field)?.score ?? '-' }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputNumber v-model="filterModel.value"/>
      </template>
    </Column>
  </DataTable>

  <EditGradeView v-if="editingGrade && editingGrade.studentId && editingGrade.testId" 
    v-model:visible="dialogVisible"
    :studentId="editingGrade.studentId"
    :testId="editingGrade.testId"
    />
</template>

<style scoped>
  @reference "@/assets/main.css";

  .custom-table{
  	--p-datatable-body-cell-padding: 0rem 0rem;
    @apply w-[100%];
  }

  .p-datatable {
    @apply m-1;
  }

  :deep(.p-paginator){
    @apply border-t border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-header){
    @apply border border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-header-cell){
    @apply border-r border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-header-cell:last-child) {
    @apply border-r-0;
  }

  :deep(.p-datatable-paginator-bottom) {
    @apply border border-t-0 border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-tbody > tr > td) {
    @apply border-r border-[var(--p-datatable-border-color)];
  }

  :deep(.p-datatable-tbody > tr > td:last-child) {
    @apply border-r-0;
  }


  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[60vh] border-l border-r border-[var(--p-datatable-border-color)];
  }
</style>