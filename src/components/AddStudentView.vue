<script setup lang="ts">
  import type { Student } from '@/models/Student';
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

  const newStudent = ref<Omit<Student, 'id'>>({
    name: '',
    surname: ''
  });

  const resetForm = () => {
    newStudent.value = { name: '', surname: '' };
  };

  const submit = () => {
    registerStore.addStudent(newStudent.value);
    resetForm();
    emit('update:visible', false);
  };

  const cancel = () => {
    emit('update:visible', false);
  };
</script>

<template>
  <Dialog header="Add Student" v-model:visible="visibleLocal" modal>
    <div class="flex flex-col gap-3 mt-3">
      <div class="flex items-center">
        <label for="name" class="w-24">Name</label>
        <InputText id="name" v-model="newStudent.name" class="flex-auto"/>
      </div>

      <div class="flex items-center">
        <label for="surname" class="w-24">Surname</label>
        <InputText id="surname" v-model="newStudent.surname" class="flex-auto" />
      </div>
    </div>

    <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" @click="submit" autofocus />
    </template>
  </Dialog>
</template>