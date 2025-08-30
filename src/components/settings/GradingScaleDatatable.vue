<script setup lang="ts">
import { computed, ref } from 'vue';
import EditGradeThresholdDialog from './EditGradeThresholdDialog.vue';
import { useGradeThresholdsStore } from '@/stores/useGradeThresholdsStore';
import { useConfirm, useToast } from 'primevue';

const gradeThresholdsStore = useGradeThresholdsStore();
const confirm = useConfirm();
const toast = useToast();

const editingGradeId = ref<string>("");
const showEditGradeThresholdDialog = ref<boolean>(false);

const sortedThresholds = computed(() => {
  return [...gradeThresholdsStore.gradeThresholds].sort((a, b) => b.minPercentage - a.minPercentage);
});

const editClick = (id: string) => {
  editingGradeId.value = id;
  showEditGradeThresholdDialog.value = true;
};

const deleteTestDialog = (id: string) => {
  confirm.require({
    message: 'Are you sure you want to proceed? The grade threshold will be deleted.',
    header: 'Delete grade threshold',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      severity: 'secondary',
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true
    },
    acceptProps: {
      severity: 'danger',
      label: 'Delete',
      icon: 'pi pi-times-circle'
    },
    accept: async () => {
      try {
        await gradeThresholdsStore.deleteGradeThreshold(id);
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Succesfully deleted grade threshold', 
          life: 3000 
        });
      } catch (err) {
        toast.add({ 
          severity: 'danger', 
          summary: 'Error', 
          detail: 'Failed to delete grade threshold', 
          life: 3000 
        });
      }
    },
  });
};  
</script>

<template>
  <DataTable :value="sortedThresholds" scrollable class="custom-table">
    <Column field="name" header="Grade">
      <template #body="{ data }">
        <div class="w-full px-3 py-4">
          {{ data.name }}
        </div>
      </template>
    </Column>
    <Column field="minPercentage" header="Percentage">
       <template #body="{ data }">
        <div class="w-full px-3 py-4">
          {{ data.minPercentage }}
        </div>
      </template>
    </Column>
    <Column field="actions" header="Actions" class="w-40">
      <template #body="{ data }">
        <div class="flex gap-3 w-full justify-center min-h-1 px-3 py-1">
          <Button icon="pi pi-file-edit" rounded  severity="info" aria-label="Edit" @click="editClick(data.id)"/>
          <Button icon="pi pi-times-circle" rounded severity="danger" aria-label="Delete" @click="deleteTestDialog(data.id)"/>
        </div>
      </template>
    </Column>
  </DataTable>
  <EditGradeThresholdDialog :id="editingGradeId" v-model:visible="showEditGradeThresholdDialog" />
</template>

<style scoped>
  :deep(.p-datatable-table-container)	{
    @apply max-h-[400px];
  }
</style>