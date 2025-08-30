<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { useToast } from 'primevue';

const registerStore = useRegisterStore();
const toast = useToast();

const saveData = async () => {
  try{
    await registerStore.exportToJson();

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Successfully saved data to json.',
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: (error as Error).message,
      life: 4000,
    });
  }
};

</script>

<template>
  <Card>
    <template #header>
      <h3>Export</h3>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h4>Save data</h4>
          <Button label="Save" icon="pi pi-file-export" class="w-fit" @click="saveData()"/>
        </div>
      </div>
    </template>
  </Card>
</template>