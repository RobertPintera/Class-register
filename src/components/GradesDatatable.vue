<script setup lang="ts">
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import EditGradeView from './EditGradeView.vue';
  import { ref } from 'vue';
  import type { Grade } from '@/models/Grade';

  const registerStore = useRegisterStore();

  const dialogVisible = ref(false);
  const editingGrade = ref<Pick<Grade, 'studentId' | 'testId'> | null>(null);

  const onCellClick = (studentId: string, testId: string) => {
    editingGrade.value = { studentId, testId };
    dialogVisible.value = true;
  };
</script>
    
<template>
  <DataTable :value="registerStore.studentGrades" editMode="cell" showGridlines tableStyle="min-width: 50rem" class="custom-table">
    <Column field="fullName" header="Student" />
    <Column
      v-for="col in registerStore.testColumns"
      :key="col.field"
      :field="col.field"
      :header="col.header">
      <template #body="{ data }">
         <div
          class="w-full h-full cursor-pointer px-3 py-4 hover:bg-blue-100 transition"
          @click="onCellClick(data.studentId, col.field)"
          style="display: block"
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
  .custom-table{
  	--p-datatable-body-cell-padding: 0rem 0rem;
    
  }
</style>