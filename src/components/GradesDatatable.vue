<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import EditGradeView from './EditGradeView.vue';
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

  const onEditTests = () => {
    console.log("Kliknięto Edytuj testy");
  };
    
</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" editMode="cell" showGridlines class="custom-table" 
  scrollable removableSort paginator paginatorPosition="bottom" :rows=10 
  v-model:filters="filters" filterDisplay="menu" :globalFilterFields="['fullName']">
    <template #header>
        <IconField>
            <InputIcon>
                <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters.fullName.value" placeholder="Global Search" />
        </IconField>
    </template>
    <template #empty>
      <div class="w-full h-full px-3 py-4">
        No students found.
      </div>
    </template>
    <Column sortable field="fullName" header="Student" filterField="fullName">
      <template #body="{ data }">
        <div
          class="w-full h-full cursor-pointer px-3 py-4 hover:bg-primary-select transition"
          @click="() => $router.push(`/student/${data.studentId}`)"
        >
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

<style setup>
  @import "tailwindcss";
  @import "tailwindcss-primeui";

  .custom-table{
  	--p-datatable-body-cell-padding: 0rem 0rem;
    @apply w-[80%];
  }

  .p-datatable {
    @apply border m-1;
  }

  .p-datatable-table-container	{
    @apply min-h-[500px] h-[60vh] border-t border-b;
  }
</style>