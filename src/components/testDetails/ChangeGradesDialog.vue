<script setup lang="ts">
import type { Test } from '@/models/Test';
import { useGradesStore } from '@/stores/useGradesStore';
import { useTestsStore } from '@/stores/useTestsStore';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue';
import { reactive, ref } from 'vue';
import z from 'zod';

const toast = useToast();
const testsStore = useTestsStore();
const gradesStore = useGradesStore();

const props = defineProps<{
  testId: string
  editedTest: Omit<Test, 'id'>
}>();
const visible = defineModel<boolean>('visible',{default: false});

const initialValues = reactive<{
  option: string,
}>({
  option: 'Reduce'
});

const resolver = ref(zodResolver(
  z.object({
    ingredient: z.string().min(1, { message: 'Option is required.' })
  }))
);

const cancel = () => {
  visible.value = false;
};

const submit = async (event: FormSubmitEvent<Record<string, any>>) => {
  if (event.valid) {
    let isValid: boolean = false;
    const selectedOption = event.states.option.value;
    console.log(selectedOption);
    console.log(props.editedTest);
    console.log(testsStore.getTest(props.testId));

    if(selectedOption === "Reduce"){
      await gradesStore.reduceGradesByTest(props.testId, props.editedTest.maxPoints);
      isValid = true;
    } else if (selectedOption === "Normalize") {
      const test = testsStore.getTest(props.testId);
      if(test){
        await gradesStore.normalizeGradesByTest(props.testId, test.maxPoints, props.editedTest.maxPoints);
        isValid = true;
      } else{
        console.error("Test doesn't exists!");
      }
    } else if (selectedOption === "Delete") {
      await gradesStore.deleteGradesByTest(props.testId);
      isValid = true;
    } else {
      console.error("Wrong data from form!");
    }

    if(isValid){
      await testsStore.updateTest(props.testId, props.editedTest);
      visible.value = false;
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Successfully edited test', 
        life: 3000 
      });
    }
  }
};
</script>

<template>
  <Dialog header="Change grades" v-model:visible="visible" :modal="true" :draggable="false" class="w-70">
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-2 w-full">
      <RadioButtonGroup name="option" class="flex flex-col gap-3 w-full">
        <div class="flex gap-1">
          <RadioButton inputId="reduce" value="Reduce" />
          <label for="reduce">Reduce grades to new maximum points</label>
        </div>
        <div class="flex gap-1">
          <RadioButton inputId="normalize" value="Normalize" />
          <label for="normalize">Normalize grades to new maximum points</label>
        </div>
        <div class="flex gap-1">
          <RadioButton inputId="delete" value="Delete" />
          <label for="delete">Delete all grades</label>
        </div>
      </RadioButtonGroup>
      <Message v-if="$form.option?.invalid" severity="error" size="small" variant="simple">{{ $form.option.error?.message }}</Message>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" severity="secondary" variant="outlined" icon="pi pi-times" @click="cancel" />
        <Button label="Edit" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>