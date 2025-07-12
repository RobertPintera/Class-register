<script setup lang="ts">
  import type { Student } from '@/models/Student';
  import { ref } from 'vue';

  const props = defineProps<{ visible: boolean }>()  
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit', student: Student): void
  }>()

  const newStudent = ref<Student>({
    id: '',
    name: '',
    surname: ''
  });

  const submit = () => {
    const id = crypto.randomUUID()
    emit('submit', { ...newStudent.value, id })
    emit('update:visible', false)
  }

  const cancel = () => {
    emit('update:visible', false)
  }
</script>

<template>
  <Dialog header="Add Student" v-model:visible="visible" modal>
    <div class="flex flex-col gap-3 mt-3">
      <span class="p-float-label">
      <InputText id="name" v-model="newStudent.name" />
      <label for="name">Name</label>
      </span>

        <span class="p-float-label">
        <InputText id="surname" v-model="newStudent.surname" />
        <label for="surname">Surname</label>
        </span>
    </div>

    <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="cancel" />
        <Button label="Add" icon="pi pi-check" @click="submit" autofocus />
    </template>
  </Dialog>
</template>