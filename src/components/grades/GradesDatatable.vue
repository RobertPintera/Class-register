<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import type { Grade } from '@/models/Grade';
import type { AdvancedFilter } from '@/models/AdvancedFilter';
import type { Test } from '@/models/Test';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useGradesStore } from '@/stores/useGradesStore';
import { useTestsStore } from '@/stores/useTestsStore';
import EditGradeDialog from './EditGradeDialog.vue';
import { useGlobalStore } from '@/stores/useGlobalStore';
import { useStudentsStore } from '@/stores/useStudentsStore';
import type { StudentGrades } from '@/models/StudentGrades';

const globalStore = useGlobalStore();
const testsStore = useTestsStore();
const settingsStore = useSettingsStore();
const gradesStore = useGradesStore();
const studentsStore = useStudentsStore();

const dialogVisible = ref(false);
const filters = ref<Record<string, AdvancedFilter>>({});

const isFrozen = computed(() => settingsStore.settings?.frozenStudentInGrades && globalStore.isMediumScreen);

const editWithDialog = computed<boolean>(() =>
  settingsStore.settings?.editWithDialog ?? false
);

const testColumns = computed(() =>
  testsStore.tests.map(test => ({
    field: test.id,
    header: test.name,
  }))
);

const studentGrades = computed<StudentGrades[]>(() =>
  studentsStore.students.map(student => {
    const row: StudentGrades = {
      studentId: student.id,
      fullName: `${student.name} ${student.surname}`,
    };

    for (const test of testsStore.tests) {
      const grade = gradesStore.grades.find(
        g => g.studentId === student.id && g.testId === test.id
      );
      row[test.id] = grade ? grade.points : -1;
    }

    return row;
  })
);

const initFilters = () => {
  filters.value['fullName'] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]};

  for (const col of testColumns.value) {
    if (!filters.value[col.field]) {
      filters.value[col.field] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
    }
  }
};

initFilters();

watch(() => testColumns.value, (columns) => {
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

const editingGrade = reactive<Pick<Grade, 'studentId' | 'testId'>>({
  studentId: "",
  testId: ""
});

const onCellClick = (studentId: string, testId: string) => {
  if (!editWithDialog.value) return;
  
  editingGrade.studentId = studentId;
  editingGrade.testId = testId;

  dialogVisible.value = true;
};

const onCellEditComplete = (event: any) => {
  const { data, newValue, field } = event;

  const grade: Grade = {
    studentId: data.studentId,
    testId: field,
    points: newValue
  };

  const test: Test | undefined = testsStore.getTest(grade.testId);
  if(!test) return;

  if (newValue !== null && newValue !== undefined) {
    if(!checkPointsRangeOfTest(grade.points, test.maxPoints)) return;

    gradesStore.updateGrade(grade);
  } else {
    gradesStore.deleteGrade(grade.studentId, grade.testId);
  }
};

const checkPointsRangeOfTest = (points: number, maxPoints: number): boolean => {
  return points >= 0 && points <= maxPoints;
};

const getTooltip = (testId: string) => {
  const test = testsStore.getTest(testId);
  return test ? `Number must be between 0 and ${test.maxPoints}` : 'No test info';
};

</script>
    
<template> 
  <DataTable :value="studentGrades" editMode="cell" class="custom-table"
    scrollable removableSort paginator paginatorPosition="bottom" :rows=10
    v-model:filters="filters" filterDisplay="menu"
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
    <Column sortable field="fullName" header="Student" filterField="fullName" :frozen="isFrozen">
      <template #body="{ data }">
        <div class="w-full cursor-pointer px-3 py-4" :data-cy="`${data.fullName}`">
          {{ data.fullName }}
        </div>
      </template>
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by FullName" />
      </template>
    </Column>
    <Column sortable
      v-for="col in testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header" :filterField="col.field" dataType="numeric">
      <template #body="{ data }">
         <div
          class="w-full min-h-1 cursor-pointer px-3 py-4"
          @click="onCellClick(data.studentId, col.field)">
          {{ gradesStore.getGrade(data.studentId, col.field)?.points ?? '-' }}
        </div>
      </template>
      <template v-if="!editWithDialog" #editor="{ data, field }">
        <InputNumber v-model="data[field]" :min="0" autofocus fluid :allowEmpty="true" 
        :defaultValue="data[field] === -1 ? null : data[field]" v-tooltip.top="getTooltip(field)"/>
      </template>
      <template #filter="{ filterModel }">
        <InputNumber v-model="filterModel.value"/>
      </template>
    </Column>
  </DataTable>

  <EditGradeDialog
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

  :deep(.p-datatable-tbody > tr > td[data-p-cell-editing="false"]:hover) {
    @apply bg-cell-datatable;
  }

  :deep(.p-datatable-tbody > tr > td) {
    @apply h-full  transition duration-200;
  }

  :deep(.p-datatable-tbody > tr > td > div) {
    @apply flex items-center h-full;
  }

  :deep(table){
    @apply h-1;
  }
</style>