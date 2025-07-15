<script setup lang="ts">
  import type { Test } from '@/models/Test';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { computed, ref } from 'vue';

  const props = defineProps<{ visible: boolean }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const registerStore = useRegisterStore();

  const newTest = ref<Omit<Test, 'id'>>({
    name: '',
    maxScore: 0,
    weight: undefined
  });

  const resetForm = () => {
    newTest.value = { name: '', maxScore: 0, weight: undefined };
  };

  const submit = () => {
    registerStore.addTest(newTest.value);
    resetForm();
    emit('update:visible', false);
  };
  
  const cancel = () => {
    resetForm();
    emit('update:visible', false);
  };

</script>

<template>
  <Dialog header="Add Test" v-model:visible="visibleLocal" modal>
    <div class="flex flex-col gap-3 mt-3">
      <div class="flex items-center">
        <label for="name" class="w-24">Name</label>
        <InputText id="name" v-model="newTest.name" class="flex-auto" />
      </div>

      <div class="flex items-center">
        <label for="maxScore" class="w-24">Max Score</label>
        <InputNumber id="maxScore" v-model="newTest.maxScore" class="flex-auto" inputId="maxScore" :min="0" />
      </div>

      <div class="flex items-center">
        <label for="weight" class="w-24">Weight</label>
        <InputNumber id="weight" v-model="newTest.weight" class="flex-auto" inputId="weight" :min="0" :step="0.1" />
      </div>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="cancel" />
      <Button label="Add" icon="pi pi-check" @click="submit" autofocus />
    </template>
  </Dialog>
</template>