<script setup lang="ts">
  import type { Student } from '@/models/Student';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import { isStudentData } from '@/utility/typeGuards';
  import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';
  import { computed, reactive } from 'vue';

  const props = defineProps<{ visible: boolean }>();
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const registerStore = useRegisterStore();

  const initialValues = reactive<Omit<Student, 'id'>>({
    name: '',
    surname: ''
  });

  const cancel = () => {
    emit('update:visible', false);
  };

  const resolver = (e: FormResolverOptions) => {
    const errors: Record<string, { message: string }[]> = {};

    if (!e.values.name || e.values.name.trim() === '') {
        errors.name = [{ message: 'Name is required.' }];
    }

    if (!e.values.surname || e.values.surname.trim() === '') {
      errors.surname = [{ message: "Surname is required."}];
    }

    return { errors };
  };

  const submit = (event: FormSubmitEvent<Record<string, any>>) => {
    if (event.valid) {
      const values = {
        name: event.states.name.value,
        surname: event.states.surname.value
      };

      if(isStudentData(values)){
        registerStore.addStudent(values);
        emit('update:visible', false);
      } else {
        console.error("Wrong data from form!");
      }
    }
  };
</script>

<template>
  <Dialog header="Add Student" v-model:visible="visibleLocal" modal>
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-3">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Name</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="in">
          <InputText id="surname" name="surname" variant="filled" class="w-60" />
          <label for="surname">Surname</label>
        </FloatLabel>
        <Message v-if="$form.surname?.invalid" severity="error" size="small" variant="simple">{{ $form.surname.error?.message }}</Message>
      </div>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Add" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>