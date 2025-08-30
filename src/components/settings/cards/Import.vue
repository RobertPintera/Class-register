<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { useConfirm, useToast } from 'primevue';

const registerStore = useRegisterStore();
const confirm = useConfirm();
const toast = useToast();

const loadDemoDataDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? Previous data will be deleted.',
    header: 'Load demo data',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      severity: 'secondary',
      label: 'Cancel',
      icon: 'pi pi-times',
      outlined: true
    },
    acceptProps: {
      label: 'Load',
      icon: 'pi pi-check'
    },
    accept: async () => {
      try {
        await registerStore.loadDemoData();
        toast.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Demo data was loaded', 
          life: 3000 
        });
      } catch (err) {
        toast.add({ 
          severity: 'danger', 
          summary: 'Error', 
          detail: 'Failed to load demo data', 
          life: 3000 
        });
      }
    },
  });
};  
</script>

<template>
  <Card>
    <template #header>
      <h3>Import</h3>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h4>Load demo data</h4>
          <Button label="Load" icon="pi pi-file-import" class="w-fit" @click="loadDemoDataDialog()"/>
        </div>
        <div class="flex flex-col gap-1">
          <h4>Load data from device</h4>
          <Button label="Load" icon="pi pi-file-import" class="w-fit"/>
        </div>
      </div>
    </template>
  </Card>
</template>