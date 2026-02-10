<script setup lang="ts">
import Card from '@/components/core/Card.vue';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { computed, ref } from 'vue';

const settingsStore = useSettingsStore();

const editGradesOption = ref([
  { name: 'With dialog', code: 'D' },
  { name: 'With input', code: 'I' },
]);

const selectedEditGrade = computed({
  get() {
    return settingsStore.settings?.editWithDialog
      ? { name: 'With dialog', code: 'D' }
      : { name: 'With input', code: 'I' };
  },
  set(value) {
    settingsStore.updateSettings({
      editWithDialog: value?.code === 'D',
    });
  }
});

const isFrozenStudentInGrades = computed({
  get: () => settingsStore.settings?.frozenStudentInGrades ?? false,
  set: v => settingsStore.updateSettings({ frozenStudentInGrades: v })
});

const isLowestGradeForTestMandatory = computed({
  get: () => settingsStore.settings?.lowestGradeForTestMandatory ?? false,
  set: v => settingsStore.updateSettings({ lowestGradeForTestMandatory: v })
});

const isLowestGradeForTestFailed = computed({
  get: () => settingsStore.settings?.lowestGradeForTestFailed ?? false,
  set: v => settingsStore.updateSettings({ lowestGradeForTestFailed: v })
});

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
        <div class="flex items-center gap-4">
          <p>Frozen student in grades:</p>
          <Checkbox v-model="isFrozenStudentInGrades" binary/>
        </div>
        <div class="flex items-center gap-4">
          <p>Assign lowest grade if a mandatory test was not taken:</p>
          <Checkbox v-model="isLowestGradeForTestMandatory" binary/>
        </div>
        <div class="flex items-center gap-4">
          <p>Assign lowest grade if a test was failed:</p>
          <Checkbox v-model="isLowestGradeForTestFailed" binary/>
        </div>
      </div>
    </template>
  </Card>
</template>