<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import EditGradeView from '@/components/grades/EditGradeView.vue';
  import { ref } from 'vue';
  import type { Grade } from '@/models/Grade';
  import { FilterMatchMode } from '@primevue/core/api';
  
  const registerStore = useRegisterStore();

  const dialogVisible = ref(false);

  const filters = ref({
    fullName: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const editingGrade = ref<Pick<Grade, 'studentId' | 'testId'> | null>(null);

  const onCellClick = (studentId: string, testId: string) => {
    editingGrade.value = { studentId, testId };
    dialogVisible.value = true;
  };    
</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" editMode="cell" showGridlines class="custom-table"
  scrollable removableSort paginator paginatorPosition="bottom" :rows=10
  v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['fullName']">
    <template #header>
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <IconField>
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters.fullName.value" placeholder="Global Search" />
        </IconField>
      </div>
    </template>
    <template #empty>
      <div class="w-full h-full px-3 py-4">
        No students found.
      </div>
    </template>
    <Column sortable field="fullName" header="Student" filterField="fullName">
      <template #body="{ data }">
        <div class="w-full h-full cursor-pointer px-3 py-4 hover:bg-primary-select transition">
          {{ data.fullName }}
        </div>
      </template>
    </Column>
    <Column sortable
      v-for="col in registerStore.testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header">
      <template #body="{ data }">
         <div
          class="w-full h-full cursor-pointer px-3 py-4 hover:bg-primary-select transition"
          @click="onCellClick(data.studentId, col.field)"
        >
          {{ registerStore.getGrade(data.studentId, col.field)?.score ?? '-' }}
        </div>
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

  :deep(.p-datatable-table-container)	{
    @apply min-h-[500px] h-[60vh] border-l border-r border-[var(--p-datatable-border-color)];
  }
</style>