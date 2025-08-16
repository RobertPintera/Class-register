<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import GradingScaleDatatable from '@/components/settings/GradingScaleDatatable.vue';
import NewGradeThresholdDialog from '@/components/settings/NewGradeThresholdDialog.vue';
import SelectSystemDialog from '@/components/settings/SelectSystemDialog.vue';
import { useRegisterStore } from '@/stores/useRegisterStore';
import { onMounted, ref, watch } from 'vue';

const registerStore = useRegisterStore();

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
</script>

<template>
  <h2 class="title-section">Settings</h2>
  <div class="cards-section">
    <Card>
      <h3>General</h3>
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex items-center gap-4">
          <h5>Editing grade:</h5>
          <Select v-model="selectedEditGrade" :options="editGradesOption" optionLabel="name" placeholder="Select"
            class="w-full md:w-56" />
        </div>
      </div>
    </Card>
    <Card>
      <h3>Grading thresholds</h3>
      <div class="mt-2 mb-4 flex justify-between">
        <Button label="New" icon="pi pi-plus" @click="showNewGradeThresholdDialog = true" />
        <Button variant="outlined" label="Select System" icon="pi pi-graduation-cap" @click="showSelectSystemDialog = true" />
      </div>
      <GradingScaleDatatable />
    </Card>
  </div>
  <SelectSystemDialog v-model:visible="showSelectSystemDialog" />
  <NewGradeThresholdDialog v-model:visible="showNewGradeThresholdDialog" />
</template>