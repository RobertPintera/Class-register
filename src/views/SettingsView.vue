<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import GradingScaleDatatable from '@/components/settings/GradingScaleDatatable.vue';
import NewGradeThresholdDialog from '@/components/settings/NewGradeThresholdDialog.vue';
import SelectSystemDialog from '@/components/settings/SelectSystemDialog.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { useConfirm, useToast } from 'primevue';
import { onMounted, ref, watch } from 'vue';

const registerStore = useRegisterStore();
const confirm = useConfirm();
const toast = useToast();

const selectedEditGrade = ref<{ name: string, code: string }>();
const editGradesOption = ref([
  { name: 'With dialog', code: 'D' },
  { name: 'With input', code: 'I' },
]);
const showSelectSystemDialog = ref<boolean>(false);
const showNewGradeThresholdDialog = ref<boolean>(false);

onMounted(() => {
  if (registerStore.settings?.editWithDialog) {
    selectedEditGrade.value = { name: 'With dialog', code: 'D' };
  } else {
    selectedEditGrade.value = { name: 'With input', code: 'I' };
  }
});

watch(selectedEditGrade, () => {
  if (selectedEditGrade.value?.code === 'D') {
    registerStore.updateSettings({ editWithDialog: true });
  } else {
    registerStore.updateSettings({ editWithDialog: false });
  }
}, { deep: true });

const loadDemoDataDialog = () => {
  confirm.require({
    message: 'Are you sure you want to proceed? Previous data will be deleted.',
    header: 'Load demo data',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Load'
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
  <h2 class="title-section">Settings</h2>
  <div class="cards-section">
    <Card>
      <template #header>
        <h3>General</h3>
      </template>
      <template #body>
        <div class="flex flex-col gap-4 mt-2">
          <div class="flex items-center gap-4">
            <h5>Editing grade:</h5>
            <Select v-model="selectedEditGrade" :options="editGradesOption" optionLabel="name" placeholder="Select"
              class="w-full md:w-56" />
          </div>
        </div>
      </template>
    </Card>
    <Card>
      <template #header>
        <h3>Grading thresholds</h3>
      </template>
      <template #body>
        <div class="mt-2 mb-4 flex justify-between">
          <Button label="New" icon="pi pi-plus" @click="showNewGradeThresholdDialog = true" />
          <Button variant="outlined" label="Select System" icon="pi pi-graduation-cap" @click="showSelectSystemDialog = true" />
        </div>
        <GradingScaleDatatable />
      </template>
    </Card>
    <div class="grid grid-cols-2 grid-rows-1">
      <Card>
        <template #header>
          <h3>Import</h3>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <h4>Load demo data</h4>
              <Button label="Load" class="w-fit"  @click="loadDemoDataDialog()"/>
            </div>
            <div class="flex flex-col gap-1">
              <h4>Load data from device</h4>
              <Button label="Load" class="w-fit"/>
            </div>
          </div>
        </template>
      </Card>
      <Card>
        <template #header>
          <h3>Export</h3>
        </template>
        <template #body>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <h4>Save data</h4>
              <Button label="Save" class="w-fit"/>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <SelectSystemDialog v-model:visible="showSelectSystemDialog" />
  <NewGradeThresholdDialog v-model:visible="showNewGradeThresholdDialog" />
</template>