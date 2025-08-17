<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import EditGradeView from '@/components/grades/EditGradeView.vue';
import { onMounted, ref, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { Grade } from '@/models/Grade';
import type { AdvancedFilter } from '@/models/AdvancedFilter';
import type { Test } from '@/models/Test';

const registerStore = useRegisterStore();
const editWithDialog = ref<boolean>();

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

onMounted(() => {
  editWithDialog.value = registerStore.settings?.editWithDialog;
});

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
  if (!editWithDialog.value) return;
  
  editingGrade.value = { studentId, testId };
  dialogVisible.value = true;
};

const onCellEditComplete = (event: any) => {
  const { data, newValue, field } = event;

  const grade: Grade = {
    studentId: data.studentId,
    testId: field,
    points: newValue
  };

  const test: Test | undefined = registerStore.getTest(grade.testId);
  if(!test) return;

  if (newValue !== null && newValue !== undefined) {
    if(!checkPointsRangeOfTest(grade.points,test.maxPoints)) return;
    registerStore.updateGrade(grade);
  } else {
    registerStore.deleteGrade(grade.studentId, grade.testId);
  }
};

const checkPointsRangeOfTest = (points: number, maxPoints: number): boolean => {
  return points >= 0 && points <= maxPoints;
};

</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" editMode="cell" class="custom-table" 
    scrollable removableSort paginator paginatorPosition="bottom" :rows=10
    :filters="filters" filterDisplay="menu"
    @cell-edit-complete="onCellEditComplete">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
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
          {{ registerStore.getGrade(data.studentId, col.field)?.points ?? '-' }}
        </div>
      </template>
      <template v-if="!editWithDialog" #editor="{ data, field }">
        <InputNumber v-model="data[field]" :min="0" autofocus fluid :allowEmpty="true" :defaultValue="data[field] === -1 ? null : data[field]"/>
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

  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[60vh];
  }
</style>