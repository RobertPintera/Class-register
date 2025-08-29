<script setup lang="ts">
import type { Student } from '@/models/Student';
import { useStudentsStore } from '@/stores/useStudentsStore';
import { isStudentData } from '@/utility/typeGuards';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { reactive, ref, watch } from 'vue';
import z from 'zod';

const studentsStore = useStudentsStore();

const props = defineProps<{studentId: string}>();
const visible = defineModel<boolean>('visible',{default: false});
const genderOptions = ref(['Male','Female']);
const initialValues = reactive({
  name: "",
  surname: "",
  gender: "Male"
});

const resolver = ref(zodResolver(
  z.object({
    name: z.string("Name is required").min(1,"Name is required"),
    surname: z.string("Surname is required").min(1,"Surname is required"),
    gender: z.enum(['Male', 'Female'],"Gender is required")
  })
));

const cancel = () => {
  visible.value = false;
};

const submit = (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    const values: Omit<Student, "id"> = {
      name: event.states.name.value,
      surname: event.states.surname.value,
      gender: event.states.gender.value,
    };

    if(isStudentData(values)){
      studentsStore.updateStudent(props.studentId,values);
      cancel();
    } else {
      console.error("Wrong data from form!");
    }
  }
};

const updateDataForm = (visible: boolean) => {
  if (visible) {
    const existingStudent = studentsStore.getStudent(props.studentId);
    if (existingStudent) {
      Object.assign(initialValues, existingStudent);
    }
  }
};

watch(visible, (newValue) => {
  updateDataForm(newValue);
});
</script>

<template>
  <Dialog header="Edit Personal Data" v-model:visible="visible" modal>
    <Form v-slot="$form" :resolver @submit="submit" :initial-values="initialValues" :validateOnBlur="true" class="flex flex-col gap-3 mt-2 w-full">
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText id="name" name="name" variant="filled" class="w-60" />
          <label for="name">Name</label>
        </FloatLabel>
        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <FloatLabel variant="on">
          <InputText id="surname" name="surname" variant="filled" class="w-60" />
          <label for="surname">Surname</label>
        </FloatLabel>
        <Message v-if="$form.surname?.invalid" severity="error" size="small" variant="simple">{{ $form.surname.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1">
        <SelectButton name="gender" :options="genderOptions" :allowEmpty="false"/>
         <Message v-if="$form.gender?.invalid" severity="error" size="small" variant="simple">{{ $form.gender.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" variant="outlined" icon="pi pi-times" @click="cancel" />
        <Button label="Save" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>