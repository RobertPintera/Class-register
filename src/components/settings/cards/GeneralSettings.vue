<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { onMounted, ref, watch } from 'vue';

const settingsStore = useSettingsStore();

const selectedEditGrade = ref<{ name: string, code: string }>();
const editGradesOption = ref([
  { name: 'With dialog', code: 'D' },
  { name: 'With input', code: 'I' },
]);

onMounted(() => {
  if (settingsStore.settings?.editWithDialog) {
    selectedEditGrade.value = { name: 'With dialog', code: 'D' };
  } else {
    selectedEditGrade.value = { name: 'With input', code: 'I' };
  }
});

watch(selectedEditGrade, () => {
  if (selectedEditGrade.value?.code === 'D') {
    settingsStore.updateSettings({ editWithDialog: true });
  } else {
    settingsStore.updateSettings({ editWithDialog: false });
  }
}, { deep: true });

</script>

<template>
  <Card>
    <template #header>
      <h3>General</h3>
    </template>
    <template #body>
      <div class="flex flex-col gap-4 mt-2">
        <div class="flex items-center gap-4">
          <p>Editing grade:</p>
          <Select v-model="selectedEditGrade" :options="editGradesOption" optionLabel="name" placeholder="Select"
            class="w-full md:w-56" />
        </div>
      </div>
    </template>
  </Card>
</template>