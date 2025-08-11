<script setup lang="ts">
import { useRegisterStore } from '@/stores/useRegisterStore';
import { isStudentData } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { ref } from 'vue';
import z from 'zod';

const registerStore = useRegisterStore();

const visible = defineModel<boolean>('visible',{default: false});

const resolver = ref(zodResolver(
  z.object({
    name: z.string("Name is required").min(1,"Name is required"),
    surname: z.string("Surname is required").min(1,"Surname is required")
  })
));

const cancel = () => {
  visible.value = false;
};

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const values = {
      name: event.states.name.value,
      surname: event.states.surname.value
    };

    if(isStudentData(values)){
      registerStore.addStudent(values);
      cancel();
    } else {
      console.error("Wrong data from form!");
    }
  }
};
</script>

<template>
  <Dialog header="Add Student" v-model:visible="visible" modal>
    <Form v-slot="$form" :resolver @submit="submit" class="flex flex-col gap-3 mt-3">
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