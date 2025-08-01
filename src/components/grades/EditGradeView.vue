<script setup lang="ts">
  import type { Grade } from '@/models/Grade';
  import type { Test } from '@/models/Test';
  import { useRegisterStore } from '@/stores/useRegisterStore';
  import type { FormResolverOptions, FormSubmitEvent } from '@primevue/forms';
  import { computed, onMounted, reactive, watch } from 'vue';

  const props = defineProps<{
    visible: boolean;
    studentId: string;
    testId: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>();

  const visibleLocal = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  });

  const registerStore = useRegisterStore();

  const test = reactive<Pick<Test, 'name' | 'maxScore'>>({
    name: "",
    maxScore: 0
  });

  const initialValues = reactive<Grade>({
    studentId: props.studentId,
    testId: props.testId,
    score: 0,
  });
  
  const updateDataForm = (visible: boolean) =>{
    if (visible) {
      const existingTest = registerStore.getTest(props.testId);
      if (existingTest) {
        Object.assign(test, { name: existingTest.name, maxScore: existingTest.maxScore});
      }

      const existingGrade = registerStore.getGrade(props.studentId, props.testId);
      if (existingGrade) {
        Object.assign(initialValues, existingGrade);
      } else {
        Object.assign(initialValues, { studentId: props.studentId, testId: props.testId, score: 0 });
      }
    }
  };

  onMounted(() => {
    const visible = props.visible;
    updateDataForm(visible);
  });

  watch(() => props.visible, (visible) => {
    updateDataForm(visible);
  });

  const cancel = () => {
    emit('update:visible', false);
  };  

  const resolver = (e: FormResolverOptions) => {
    const errors: Record<string, { message: string }[]> = {};

    if (e.values.score < 0 || e.values.score > test.maxScore) {
        errors.name = [{ message: 'Score is required.' }];
    };

    return { errors };
  };

  const submit = (event: FormSubmitEvent<Record<string, any>>) => {
    if (event.valid) {
      const score = event.states.score?.value;

      if(typeof score === 'number'){
         const grade: Grade = {
          studentId: props.studentId,
          testId: props.testId,
          score,
        };

        if(score !== undefined) {
          registerStore.updateGrade(grade);
        }
        else{
          registerStore.deleteGrade(props.studentId, props.testId);
        }
        
        emit('update:visible', false);
      } else {
        console.error("Wrong data from form!");
      }
    }
  };

</script>

<template>
  <Dialog header="Edit Grade" v-model:visible="visibleLocal" modal>
    <Form v-slot="$form" :initialValues :resolver @submit="submit" class="flex flex-col gap-3 mt-3">
      <div class="flex flex-col gap-1">
        <h6>Max score of test: {{ test.maxScore }}</h6>
        <FloatLabel variant="in">
          <InputNumber id="score" name="score" class="w-60" variant="filled" :min="0" :max="10000" :maxFractionDigits="2" :step="0.01"/>
          <label for="score">Score</label>
        </FloatLabel>
        <Message v-if="$form.maxScore?.invalid" severity="error" size="small" variant="simple">{{ $form.maxScore.error?.message }}</Message>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" @click="cancel" />
        <Button label="Save" icon="pi pi-check" type="submit" autofocus />
      </div>
    </Form>
  </Dialog>
</template>